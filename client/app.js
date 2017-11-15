import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './redux/configureStore'

import Routes from './router'

export default class App extends Component {
    state = {
        store: null,
        history: null,
    }

    componentWillMount() {
        const store = configureStore({})
        this.setState({
            store,
            history: syncHistoryWithStore(browserHistory, store),
        })
    }

    render() {
        return (
            <Provider store={this.state.store}>
                <Routes history={this.state.history} />
            </Provider>
        )
    }
}

// const App = () => (
//    <Provider store={store}>
//        <Routes history={history} />
 //   </Provider>
// )
//
// export default App
