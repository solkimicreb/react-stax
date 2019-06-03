import { store } from 'react-stax'
import * as userApi from '../api/user'

const userStore = store({
  user: undefined,
  async init() {
    userStore.user = await userApi.getMe()
  },
  async login(user) {
    userStore.user = await userApi.login(user)
  },
  async register(user) {
    userStore.user = await userApi.register(user)
  }
})

export default userStore
