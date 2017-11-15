import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Message, Label } from 'semantic-ui-react'

import './articleItem.scss'

export default class ArticleItem extends Component {
    renderNewPharagraphs = data => data.map(item => (
        <div className="to-aprove clearfix" key={item._id}>
            {
                (
                    (!item.isApproved && !this.props.showApproved) && (
                        <div>
                            <p>{item.text}</p>
                            <Button
                                size="small"
                                color="green"
                                floated="right"
                                onClick={() => this.props.onApprove({ id: item._id, status: true})}
                            >
                                APPROVE
                            </Button>
                        </div>
                    )
                ) || (
                    (item.isApproved && this.props.showApproved) && (
                        <div>
                            <p>{item.text}</p>
                            <Button
                                size="small"
                                color="red"
                                floated="right"
                                onClick={() => this.props.onApprove({ id: item._id, status: false})}
                            >
                                Cancel
                            </Button>
                        </div>
                    )
                )
            }
        </div>
    ))

    renderPharagraphs = () => this.props.data.pharagraphs.filter(item => item.usersText.length > 0).map((item) => {
        const newPharagraphs = item.usersText.filter(obj => obj.text !== '')

        return (
            <div className="pharagraph" key={item._id}>
                <h4>ORIGINAL TEXT</h4>
                <p className="original">{item.originalText}</p>
                {
                    newPharagraphs.length &&
                    <h4>USER SUGGESTIONS</h4>
                }
                { this.renderNewPharagraphs(newPharagraphs) }
            </div>
        )
    })

    render() {
        const pharagraphs = this.renderPharagraphs()
        return (
            <div className="article-item">
                {
                    this.props.data.title &&
                    <Label attached="top" size="big">{this.props.data.title}</Label>
                }
                <div className="article-link">
                    <Label
                        as="a"
                        href={this.props.data.url}
                        target="_blank"
                        color="teal"
                        ribbon
                    >
                        Article Link
                    </Label>
                </div>

                <Button
                    negative
                    size="mini"
                    onClick={() => this.props.deleteArticleHandler(this.props.data._id)}
                >
                    Delete Article
                </Button>
                {
                    this.props.data.subtitle &&
                    <h4>{this.props.data.subtitle}</h4>
                }
                <div>
                    { pharagraphs.length ? pharagraphs : <Message visible>No pharagraphs to approve.</Message> }
                </div>
            </div>
        )
    }
}

ArticleItem.propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    deleteArticleHandler: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
    showApproved: PropTypes.bool.isRequired,
}

ArticleItem.defaultProps = {

}

