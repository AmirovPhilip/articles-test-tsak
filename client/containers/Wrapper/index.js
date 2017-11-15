import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Menu } from 'semantic-ui-react'

const Wrapper = props => (
    <div className="page-wrapper">
        <Menu>
            <Menu.Item>
                <Link to="/fb">Home</Link>
            </Menu.Item>

            <Menu.Item>
                <Link to="/fb/results">Results</Link>
            </Menu.Item>

            <Menu.Item>
                <Link to="/fb/info">Info</Link>
            </Menu.Item>
        </Menu>
        {props.children}
    </div>
)


Wrapper.propTypes = {
    children: PropTypes.object.isRequired, // eslint-disable-line
}

export default Wrapper
