import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { store, view } from 'react-easy-stack';
import MenuIcon from 'react-icons/lib/fa/bars';

const mql = window.matchMedia(`(min-width: 600px)`);
export const sidebarStore = store({
  docked: mql.matches,
  open: mql.matches
});
mql.addListener(() => {
  sidebarStore.docked = mql.matches;
  if (sidebarStore.docked) {
    sidebarStore.open = true;
  }
});

export function toggle() {
  if (sidebarStore.docked) {
    sidebarStore.open = true;
  } else {
    sidebarStore.open = !sidebarStore.open;
  }
}

function Sidebar({ children }) {
  const style = {
    transform: sidebarStore.open ? 'none' : 'translateX(-250px)',
    opacity: sidebarStore.open ? 1 : 0
  };

  return (
    <Fragment>
      {!sidebarStore.docked && (
        <span onClick={toggle}>
          <MenuIcon className="sidebar-toggle" />
        </span>
      )}
      {ReactDOM.createPortal(
        <div style={style} className="sidebar">
          {children}
        </div>,
        document.getElementById('sidebar')
      )}
    </Fragment>
  );
}
export default view(Sidebar);
