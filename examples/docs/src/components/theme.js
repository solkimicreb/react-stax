import { store } from 'react-stax'

export const colors = {
  code: '#f6f8fa',
  text: '#24292e',
  accent: '#0366d6',
  textLight: 'lightgray',
  accentLight: 'white',
  background: '#24292e',
  backgroundLight: 'white'
}

export const ease = {
  in: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  out: 'cubic-bezier(0.4, 0.0, 1, 1)',
  both: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
}

const mqlTiny = window.matchMedia('(max-width: 800px)')
const mql = window.matchMedia('(max-width: 1100px)')
const mqlLarge = window.matchMedia('(min-width: 1700px)')
export const layout = store({
  topbarHeight: 50,
  actionbarHeight: 40,
  sidebarWidth: 250,
  chatWidth: 500,
  appWidth: 800,
  touchZone: 20,
  isTiny: mqlTiny.matches,
  isMobile: mql.matches,
  isLarge: mqlLarge.matches,
  currentPage: {},
  get correction() {
    let takenSpace = 0
    if (!this.isMobile && this.currentPage.sidebar !== false) {
      takenSpace += this.sidebarWidth
    }
    if (this.isLarge && this.currentPage.chat !== false) {
      takenSpace -= this.chatWidth
    }
    return takenSpace
  }
})
mqlTiny.addListener(() => (layout.isTiny = mqlTiny.matches))
mql.addListener(() => (layout.isMobile = mql.matches))
mqlLarge.addListener(() => (layout.isLarge = mqlLarge.matches))
