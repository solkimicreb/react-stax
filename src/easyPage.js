import { activate, deactivate } from 'react-easy-params'
import { easyComp } from 'react-easy-state'
import { pageStores } from './stores'

export default function easyPage (Page, store, name) {
  deactivate(store)
  pageStores.set(name, store)
  Page = easyComp(Page)

  class EasyPageHOC extends Page {
    componentWillMount () {
      if (super.componentWillMount) {
        super.componentWillMount()
      }
      /*if (activePages.has(Page)) {
        throw new Error(
          `Only one instance of ${Page} page can be active at a time.`
        )
      }*/
      activate(store)
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }
      deactivate(store)
    }
  }

  copyStaticProps(Page, EasyPageHOC)
  return EasyPageHOC
}

function copyStaticProps (fromComp, toComp) {
  toComp.displayName = fromComp.displayName || fromComp.name
  toComp.contextTypes = fromComp.contextTypes
  toComp.childContextTypes = fromComp.childContextTypes
  toComp.propTypes = fromComp.propTypes
  toComp.defaultProps = fromComp.defaultProps
}
