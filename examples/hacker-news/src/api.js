import firebase from 'firebase/app'
import 'firebase/database'
import EventListener from 'events'
import { API_URL, API_VERSION, STORIES_PER_PAGE, STORY_TYPES } from './config'

firebase.initializeApp({ databaseURL: API_URL })
const api = firebase.database().ref(API_VERSION)

export const events = new EventListener()
const cache = new Map()
const idsByType = new Map()

// keep the story ids real-time updated, broadcast an event when they change
STORY_TYPES.forEach(type => {
  api.child(`${type}stories`).on('value', async snapshot => {
    const ids = snapshot.val()
    idsByType.set(type, ids)
    // instead of this just invalidate the cache for specific items I guess
    await Promise.all(
      ids.map(id => fetch(`item/${id}`, false))
    )
    events.emit(type, ids)
  })
})

function fetch(child, useCache = true) {
  if (useCache && cache.has(child)) {
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

function fetchIdsByType(type, page) {
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

export function fetchStoriesByType(type, page, useCache) {
  return fetchIdsByType(type, page)
    .then(ids => fetchStories(ids, useCache))
}

export function fetchStories(ids, useCache) {
  ids = ids || []
  return Promise.all(ids.map(
    id => fetchStory(id, useCache)
  ))
}

export function fetchStory(id, useCache) {
  return fetch(`item/${id}`, useCache)
}

export function fetchComment(id, useCache) {
  return fetch(`item/${id}`, useCache)
}

export function fetchUser(id, useCache) {
  return fetch(`user/${id}`, useCache)
}
