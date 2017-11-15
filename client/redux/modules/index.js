import { combineReducers } from 'redux'
import { all } from 'redux-saga/effects'
import { routerReducer } from 'react-router-redux'
import { reducer as notifications } from 'react-notification-system-redux'

import articles, { articlesSaga } from './articles'

const appReducer = combineReducers({
    articles,
    routing: routerReducer,
    notifications,
})

const rootReducer = (state, action) => appReducer(state, action)

export default rootReducer

export function* rootSaga() {
    yield all([
        articlesSaga(),
    ])
}
