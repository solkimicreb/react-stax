import firebase from 'firebase/app'
import 'firebase/database'
import EventListener from 'events'
import { API_URL, API_VERSION, STORIES_PER_PAGE, TYPES } from './config'

firebase.initializeApp({ databaseURL: API_URL })
const api = firebase.database().ref(API_VERSION)

export const events = new EventListener()
const cache = new Map()
const idsByType = new Map()

// keep the story ids real-time updated, broadcast an event when they change
TYPES.forEach(type => {
  api.child(`${type}stories`).on('value', snapshot => {
    idsByType.set(type, snapshot.val())
    events.emit(type)
  })
})

export function fetch(child) {
  if (cache.has(child)) {
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once(
        'value',
        snapshot => {
          const val = snapshot.val()
          cache.set(child, val)
          resolve(val)
        },
        reject
      )
    })
  }
}

export function fetchIdsByType(type, page) {
  if (idsByType.has(type)) {
    const ids = idsByType.get(type)
    return Promise.resolve(
      ids.slice(page * STORIES_PER_PAGE, (page + 1) * STORIES_PER_PAGE)
    )
  }
  return fetch(`${type}stories`).then(ids =>
    ids.slice(page * STORIES_PER_PAGE, (page + 1) * STORIES_PER_PAGE)
  )
}

export function fetchStoriesByType(type, page) {
  return fetchIdsByType(type, page).then(fetchStories)
}

export function fetchStories(ids) {
  ids = ids || []
  return Promise.all(ids.map(fetchStory))
}

export function fetchStory(id) {
  return fetch(`item/${id}`)
}

export function fetchUser(id) {
  return fetch(`user/${id}`)
}
