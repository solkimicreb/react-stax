import { toPathArray, toParams, toScroll } from '../../utils'
import { history } from '../../integrations'

history.replace({
  path: toPathArray(location.pathname),
  params: toParams(location.search),
  scroll: toScroll(location.hash),
  session: history.current.session
})
