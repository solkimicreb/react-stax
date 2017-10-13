import { activate, deactivate } from 'react-easy-params'
import { easyComp } from 'react-easy-state'
import { activePages } from './stores'

export default function easyPage (Page, store) {
  return class EasyPageHOC extends easyComp(Page) {
    static displayName = Page.displayName || Page.name;
    static contextTypes = Page.contextTypes;
    static propTypes = Page.propTypes;
    static defaultProps = Page.defaultProps;

    componentWillMount () {
      if (super.componentWillMount) {
        super.componentWillMount()
      }
      if (activePages.has(Page)) {
        throw new Error(
          `Only one instance of ${Page} page can be active at a time.`
        )
      }
      activePages.set(Page, store)
      activate(store)
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }
      activePages.delete(Page)
      deactivate(store)
    }

    render () {
      activate(store)
      return super.render()
    }
  }
}
