import 'react-hot-loader/patch';
import ReactDOM from 'react-dom'
import React from 'react'
import { AppContainer } from 'react-hot-loader'

import App from './app'


import './styles/global.scss'

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root'),
    );
}

render(App)

if (module.hot) {
    module.hot.accept('./app', () => {
        render(App)
    });
}

