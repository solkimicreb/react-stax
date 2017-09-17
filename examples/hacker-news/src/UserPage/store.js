import { easyStore, easyParams } from 'react-easy-stack'
import { fetchUser } from '../api'

const store = easyStore({
  id: '',
  async fetchUser () {
    const user = await fetchUser(this.id)
    Object.assign(this, user)
  }
})

easyParams(store, {
  id: ['url']
})

export default store
