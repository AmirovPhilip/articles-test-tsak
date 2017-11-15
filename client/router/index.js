import React from 'react'
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, Redirect } from 'react-router'

import Wrapper from '../containers/Wrapper'
import Info from '../containers/Info'
import Article from '../containers/Article'
import Results from '../containers/Results'

const Routes = props => (
    <Router history={props.history} key={Math.random()}>
        <Route path="/fb" component={Wrapper} >
            <IndexRoute component={Article} />
            <Route path="info" component={Info} />
            <Route path="results" component={Results} />
            {/*<Redirect path="*" to="/fb" />*/}
        </Route>
        <Redirect from="/" to="/fb" />
    </Router>
)

Routes.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
}

export default Routes
