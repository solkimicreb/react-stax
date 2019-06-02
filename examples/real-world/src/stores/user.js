import { store } from 'react-stax'
import * as userApi from '../api/user'

const user = store({
  user: undefined,
  async init() {
    user.user = await userApi.getMe()
  },
  async login(user) {
    user.user = await userApi.login(user)
  }
})

export default user
