import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import entities from './entities/reducer'
import editor from './editor/reducer'
import progress from './progress/reducer'
import settings from './settings/reducer'
import modal from './modal/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  entities,
  editor,
  progress,
  settings,
  modal
})

export default (state, action) => {
  if (action.type === 'RESET') {
    const { routing } = state
    state = { routing }
  }

  return reducer(state, action)
}
