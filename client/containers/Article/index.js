import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Segment, Dimmer, Loader, Message } from 'semantic-ui-react'

import { articleUrlChanged, articleRequested, newUserTextRequested } from '../../redux/modules/articles'
import { takeArticle, takeArticleUrl, takeEditedPharagraph, takeUserTextError } from '../../selectors/articles'

import ArticleSearch from '../../components/ArticleSearch'
import List from '../../components/List'
import Pharagraph from '../../components/Pharagraph'

import './article.scss'

class Article extends Component {
    componentWillMount() {
        const { articleUrl } = this.props.location.query
        if (articleUrl)
            this.getArticleWithQuery(articleUrl)
    }

    getArticleWithQuery = (path) => {
        if (path) {
            this.props.onChangeHandler(decodeURI(path))
            this.props.onSearchClick()
        }
    }
    renderItem = item => (
        <Pharagraph
            data={item}
            onSendChanges={this.props.onSendChanges}
            key={item._id}
            loading={this.props.editedPharagraphId === item._id}
            error={this.props.editedPharagraphId === item._id ? this.props.pharagraphError : ''}
        />
    )

    render() {
        return (
            <div className="article-page">
                <ArticleSearch
                    url={this.props.articleUrl}
                    onChange={this.props.onChangeHandler}
                    onSearch={this.props.onSearchClick}
                />
                <Container text>

                    {
                        this.props.article.cata({
                            NotAsked: () => null,
                            Loading: () => (
                                <Segment>
                                    <Dimmer active inverted>
                                        <Loader size="medium" inverted>Loading</Loader>
                                    </Dimmer>
                                </Segment>
                            ),
                            Failed: error => <Message warning content={error} />,
                            Succeeded: data => (
                                <div>
                                    {
                                        data.title &&
                                        <h1>{data.title}</h1>
                                    }
                                    {
                                        data.subtitle &&
                                        <h2>{data.subtitle}</h2>
                                    }
                                    {
                                        data.pharagraphs.length &&
                                        <List
                                            data={data.pharagraphs}
                                            renderList={this.renderItem}
                                            onSendChanges={this.props.onSendChanges}
                                            editedPharagraphId={this.props.editedPharagraphId}
                                            error={this.props.pharagraphError}
                                        />
                                    }
                                </div>
                            ),
                        })
                    }
                </Container>
            </div>
        )
    }
}


Article.propTypes = {
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    article: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        pharagraphs: PropTypes.arrayOf(PropTypes.any),
    }),
    articleUrl: PropTypes.string.isRequired,
    editedPharagraphId: PropTypes.string,
    pharagraphError: PropTypes.string,
    onChangeHandler: PropTypes.func.isRequired,
    onSearchClick: PropTypes.func.isRequired,
    onSendChanges: PropTypes.func.isRequired,
}

Article.defaultProps = {
    editedPharagraphId: '',
    pharagraphError: '',
    article: {},
}

export default connect(
    state => ({
        article: takeArticle(state),
        articleUrl: takeArticleUrl(state),
        editedPharagraphId: takeEditedPharagraph(state)._id,
        pharagraphError: takeUserTextError(state),
    }),
    dispatch => ({
        onChangeHandler(val) {
            dispatch(articleUrlChanged(val))
        },
        onSearchClick(event) {
            if (event)
                event.preventDefault()
            dispatch(articleRequested())
        },
        onSendChanges(data, newText) {
            dispatch(newUserTextRequested(data, newText))
        },
    }),
)(Article)
