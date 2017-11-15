import React from 'react'
import PropTypes from 'prop-types'
import { Input, Container, Header, Message } from 'semantic-ui-react'


import './articleSearch.scss'

const ArticleSearch = props => (
    <div>
        <form onSubmit={e => props.onSearch(e)}>
            <Container
                className="search-form"
                text
            >
                <Header
                    as="h2"
                    className="text-center"
                >
                    Enter article link:
                </Header>
                <Input
                    action={{
                        color: 'teal',
                        type: 'submit',
                        content: 'Search',
                    }}
                    className="search-inp"
                    placeholder="https://www.dagbladet.no/"
                    onChange={e => props.onChange(e.target.value)}
                    value={props.url}
                />
            </Container>
        </form>
    </div>
)

ArticleSearch.propTypes = {
    url: PropTypes.string.isRequired,
    error: PropTypes.string,

    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
}

ArticleSearch.defaultProps = {
    error: '',
}

export default ArticleSearch

