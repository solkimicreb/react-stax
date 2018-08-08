import { route } from 'react-stax'
import { layout } from './theme'
import * as routes from '../routes'
import { chatStore } from './Chat'
import { sidebarStore } from './Sidebar'

const THRESHOLD = 20
let isTouching = false
let startTouch

function onTouchStart(ev) {
  startTouch = ev.touches[0]
  if (
    !chatStore.open &&
    !sidebarStore.open &&
    layout.touchZone < startTouch.pageX &&
    startTouch.pageX < window.innerWidth - layout.touchZone
  ) {
    isTouching = true
  }
}

function onTouchMove(ev) {
  if (isTouching) {
    const touch = ev.touches[0]
    let xDiff = startTouch.pageX - touch.pageX
    let yDiff = startTouch.pageY - touch.pageY
    const offset = xDiff < 0 ? -1 : 1
    xDiff = Math.abs(xDiff)
    yDiff = Math.abs(yDiff)

    if (THRESHOLD < xDiff) {
      if (xDiff < 5 * yDiff) {
        isTouching = false
        return
      }
      document.body.style.overflow = 'hidden'
      goToPage(offset)
      onTouchEnd()
    }
  }
}

function onTouchEnd(ev) {
  if (isTouching) {
    isTouching = false
    document.body.style.overflow = null
  }
}

window.addEventListener('touchstart', onTouchStart, { passive: true })
window.addEventListener('touchmove', onTouchMove, { passive: true })
window.addEventListener('touchend', onTouchEnd, { passive: true })
window.addEventListener('touchcancel', onTouchEnd, { passive: true })

function goToPage(offset) {
  const idx = routes.all.findIndex(
    page => page.path === layout.currentPage.path
  )

  const nextPage = routes.all[idx + offset]

  if (nextPage) {
    route({ to: nextPage.path })
  }
}
