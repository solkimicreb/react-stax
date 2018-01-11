import { easyStore, params } from 'react-easy-stack'
import { fetchUser } from '../api'

const store = {
  async init () {
    this.user = await fetchUser(params.id)
  }
}

export default easyStore(store)
