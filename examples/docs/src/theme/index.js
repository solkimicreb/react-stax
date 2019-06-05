import { injectGlobal } from 'styled'
import { store } from 'react-easy-state'
import * as commonTheme from './common'
import * as mainTheme from './main'
import * as mobileTheme from './mobile'

const theme = store(commonTheme)
const mql = window.matchMedia(
  `(min-width: ${commonTheme.contentWidth + commonTheme.sidebarWidth}px)`
)

function switchTheme () {
  if (mql.matches) {
    Object.assign(theme, mainTheme)
  } else {
    Object.assign(theme, mobileTheme)
  }
}

switchTheme()
mql.addListener(switchTheme)

export default theme
