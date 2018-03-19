import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

let store = {}
global.localStorage = {
  clear() {
    store = {}
  },
  getItem(key) {
    return store[key] || null
  },
  setItem(key, value) {
    store[key] = value
  },
  removeItem(key) {
    delete store[key]
  }
}
