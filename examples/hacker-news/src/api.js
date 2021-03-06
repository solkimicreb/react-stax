import firebase from 'firebase/app'
import 'firebase/database'
import appStore from './stores/app'
import { API_URL, API_VERSION, STORIES_PER_PAGE, STORY_TYPES } from './config'

firebase.initializeApp({ databaseURL: API_URL })
const api = firebase.database().ref(API_VERSION)

const cache = new Map()

// keep the story ids real-time updated, broadcast an event when they change
STORY_TYPES.forEach(type => {
  api.child(`${type}stories`).on('value', snapshot => {
    const ids = snapshot.val()
    cache.set(`${type}stories`, ids)
  })
})

api.child('updates').on('value', snapshot => {
  const { items = [], profiles = [] } = snapshot.val()
  items.forEach(id => cache.delete(`item/${id}`))
  profiles.forEach(id => cache.delete(`user/${id}`))
})

function fetch (child) {
  if (cache.has(child)) {
    return Promise.resolve(cache.get(child))
  } else {
    appStore.loading = true
    return new Promise((resolve, reject) => {
      api.child(child).once(
        'value',
        snapshot => {
          const val = snapshot.val()
          cache.set(child, val)
          appStore.loading = false
          resolve(val)
        },
        err => {
          appStore.loading = false
          reject(err)
        }
      )
    })
  }
}

function fetchIdsByType (type, startPage = 0, endPage = startPage) {
  return fetch(`${type}stories`).then(ids =>
    ids.slice(startPage * STORIES_PER_PAGE, (endPage + 1) * STORIES_PER_PAGE)
  )
}

export function fetchStoriesByType (type, startPage, endPage) {
  return fetchIdsByType(type, startPage, endPage).then(fetchStories)
}

export async function fetchStories (ids = []) {
  const stories = await Promise.all(ids.map(fetchStory))
  return stories.filter(story => story !== null)
}

export function fetchStory (id) {
  return fetch(`item/${id}`)
}

export async function fetchFullStory (id) {
  const story = await fetchStory(id)
  /* await */ fetchComments(story)
  return story
}

export async function fetchComments (item) {
  if (item !== null && item.kids && item.kids.length) {
    item.comments = await Promise.all(item.kids.map(fetchComment))
    /* await */ Promise.all(item.comments.map(fetchComments))
  }
}

export function fetchComment (id) {
  return fetch(`item/${id}`)
}

export function fetchUser (id) {
  return fetch(`user/${id}`)
}
