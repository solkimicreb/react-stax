import { route } from 'react-stax'
import { layout } from './theme'
import * as routes from '../routes'

const TOUCH_ZONE = 20
const THRESHOLD = 40
let isTouching = false
let touchStart = 0
let touchDiff = 0

function onTouchStart(ev) {
  touchStart = ev.touches[0].pageX

  if (touchStart < TOUCH_ZONE || window.innerWidth - TOUCH_ZONE < touchStart) {
    isTouching = true
    document.body.style.overflow = 'hidden'
  }
}

function onTouchMove(ev) {
  if (isTouching) {
    touchDiff = touchStart - ev.touches[0].pageX

    if (THRESHOLD < touchDiff) {
      goToPage(1)
      onTouchEnd()
    } else if (touchDiff < -THRESHOLD) {
      goToPage(-1)
      onTouchEnd()
    }
  }
}

function onTouchEnd(ev) {
  touchStart = touchDiff = 0
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
  route({ to: nextPage.path })
}
