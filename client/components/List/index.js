import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Pharagraph from '../Pharagraph'

import './list.scss'

export default class List extends Component {
    renderList = () => this.props.data.map(item =>
        this.props.renderList(item)
    )

    render() {
        return (
            <div>
                { this.renderList() }
            </div>
        )
    }
}

List.propTypes = {
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    renderList: PropTypes.func.isRequired,
}