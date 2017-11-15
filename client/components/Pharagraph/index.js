import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Message, Button } from 'semantic-ui-react'

import './pharagraph.scss'

export default class Pharagraph extends Component {
    state = {
        newText: '',
    }

    onChangeHandler = (e) => {
        const { target } = e
        this.setState({ newText: target.value })
    }

    onClickHandler = (item, text) => {
        this.props.onSendChanges(item, text)
        this.setState({ newText: '' })
    }

    render() {
        return (
            <div className="pharagraph">
                <h4>ORIGINAL TEXT</h4>
                <p>
                    {this.props.data.originalText}
                </p>
                <h4>USERS VERSION</h4>
                <textarea
                    value={this.state.newText}
                    onChange={e => this.onChangeHandler(e)}
                />
                <div className="clearfix">
                    {
                        this.props.error && (
                            <Message color="yellow">
                                {this.props.error}
                            </Message>
                        )
                    }
                    <Button
                        primary
                        floated="right"
                        onClick={() => this.onClickHandler(this.props.data, this.state.newText)}
                        loading={this.props.loading}
                    >
                        Send Changes
                    </Button>
                </div>
            </div>
        )
    }
}

Pharagraph.propTypes = {
    data: PropTypes.shape({
        originalText: PropTypes.string,
    }).isRequired,
    onSendChanges: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
}

Pharagraph.defaultProps = {
    error: '',
}

