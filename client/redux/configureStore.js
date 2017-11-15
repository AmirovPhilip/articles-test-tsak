import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import rootReducer, { rootSaga } from './modules'
import { apiMiddleware } from '../api'


const sagaMiddleware = createSagaMiddleware()


export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(apiMiddleware, sagaMiddleware)),
    )

    sagaMiddleware.run(rootSaga, store.dispatch)

    if (module.hot) {
        module.hot.accept('./modules/index', () => {
            const newReducer = require('./modules/index').default;// eslint-disable-line
            store.replaceReducer(newReducer);
        });
    }

    return store
}
