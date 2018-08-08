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
    layout.touchZone < startTouch.pageX &&
    startTouch.pageX < window.innerWidth - layout.touchZone
  ) {
    isTouching = true
  }
}

function onTouchMove(ev) {
  if (isTouching) {
    const touch = ev.touches[0]
    const xDiff = startTouch.pageX - touch.pageX
    const yDiff = startTouch.pageY - touch.pageY

    if (THRESHOLD < xDiff) {
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        isTouching = false
        return
      }
      document.body.style.overflow = 'hidden'
      goToPage(1)
      onTouchEnd()
    } else if (xDiff < -THRESHOLD) {
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        isTouching = false
        return
      }
      document.body.style.overflow = 'hidden'
      goToPage(-1)
      onTouchEnd()
    }
  }
}

function onTouchEnd(ev) {
  isTouching = false
  document.body.style.overflow = null
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

  if (nextPage && !chatStore.open && !sidebarStore.open) {
    route({ to: nextPage.path })
  }
}
