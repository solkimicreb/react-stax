import React from 'react'
import { store, view } from 'react-stax'
import LinearProgress from '@material-ui/core/LinearProgress'

const loaderStore = store({
  isLoading: false
})

export function startLoading () {
  loaderStore.isLoading = true
}

export function stopLoading () {
  loaderStore.isLoading = false
}

export default view(() =>
  loaderStore.isLoading ? <LinearProgress color='secondary' /> : null
)
