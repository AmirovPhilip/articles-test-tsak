import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react'

import { RemoteData } from '../../redux/types'
import { allArticlesRequested, deleteArticleRequested, userTextApproveRequested } from '../../redux/modules/articles'
import { takeAllArticles } from '../../selectors/articles'
import parseBoolean from '../../common'

import ArticleItem from '../../components/ArticleItem'

import './results.scss'

class Results extends Component {
    componentWillMount() {
        const showApproved = this.props.location.query.showApproved ?
            parseBoolean(this.props.location.query.showApproved) : false
        this.props.getArticles(showApproved)
    }

    renderArticles = data => data.map(item => (
        <ArticleItem
            data={item}
            showApproved={
                this.props.location.query.showApproved ?
                    parseBoolean(this.props.location.query.showApproved) : false
            }
            deleteArticleHandler={this.props.deleteArticle}
            onApprove={this.props.userTextApprove}
            key={item._id}
        />
    ))

    render() {
        return (
            <div className="results-page">
                <Container text>
                    {
                        this.props.articleList.cata({
                            NotAsked: () => null,
                            Loading: () => (
                                <Segment>
                                    <Dimmer active inverted>
                                        <Loader size="medium" inverted>Loading</Loader>
                                    </Dimmer>
                                </Segment>
                            ),
                            Failed: error => <div>{error}</div>,
                            Succeeded: data => (
                                <div>
                                    {
                                        data.length && (this.renderArticles(data))
                                        || <div>No results</div>

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

Results.propTypes = {
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    getArticles: PropTypes.func.isRequired,
    deleteArticle: PropTypes.func.isRequired,
    userTextApprove: PropTypes.func.isRequired,
    articleList: PropTypes.oneOfType(
        PropTypes.shape({
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    url: PropTypes.string.isRequired,
                    title: PropTypes.string,
                    subtitle: PropTypes.string,
                    pharagraphs: PropTypes.array.isRequired,
                }),
            ),
        }),
        PropTypes.oneOf([RemoteData.NotAsked, RemoteData.Loading]),
    ),
}

Results.defaultProps = {

}

export default connect(
    state => ({
        articleList: takeAllArticles(state),
    }),
    dispatch => ({
        getArticles(showApproved) {
            dispatch(allArticlesRequested(showApproved))
        },
        deleteArticle(id) {
            dispatch(deleteArticleRequested(id))
        },
        userTextApprove(data) {
            dispatch(userTextApproveRequested(data))
        },
    }),
)(Results)
