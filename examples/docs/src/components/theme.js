import { store } from 'react-easy-stack';

export const colors = {
  text: '#24292e',
  accent: '#0366d6',
  textLight: 'lightgray',
  accentLight: 'white',
  background: '#24292e',
  backgroundLight: 'white'
};

export const ease = {
  in: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  out: 'cubic-bezier(0.4, 0.0, 1, 1)',
  both: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
};

const mql = window.matchMedia('(max-width: 800px)');
export const layout = store({
  topbarHeight: 50,
  actionbarHeight: 40,
  sidebarWidth: 250,
  appWidth: 800,
  isMobile: mql.matches,
  touchZone: 40
});
mql.addListener(() => (layout.isMobile = mql.matches));
