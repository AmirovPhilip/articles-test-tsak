import _ from 'lodash'
import { createAction, handleActions } from 'redux-actions'
import { put, takeLatest, select, takeEvery, call } from 'redux-saga/effects'

import { RemoteData } from '../types'
import * as api from '../../api'
import { takeArticleUrl } from '../../selectors/articles'
import { addQuery } from '../../router/utils'

export const initialState = {
    allArticlesData: RemoteData.NotAsked,
    articleData: RemoteData.NotAsked,
    url: '',
    newUserTextError: '',
    editedPharagraph: {},
}

export const articleUrlChanged = createAction('URL_FOR_ARTICLE_CHANGED', url => ({ url }))
export const articleRequested = createAction('GET_ARTICLE_REQUESTED')
export const articleSuccess = createAction('GET_ARTICLE_SUCCESS', data => ({ data }))
export const articleFailure = createAction('GET_ARTICLE_FAILURE', error => ({ error }))

export const allArticlesRequested = createAction('GET_ALL_ARTICLES_REQUESTED', query => ({ query }))
export const allArticlesSuccess = createAction('GET_ALL_ARTICLES_SUCCESS', data => ({ data }))
export const allArticlesFailure = createAction('GET_ALL_ARTICLES_FAILURE', error => ({ error }))

export const deleteArticleRequested = createAction('DELETE_ARTICLE_REQUEST', id => ({ id }))
export const deleteArticleSuccess = createAction('DELETE_ARTICLE_SUCCESS', id => ({ id: id }))
export const deleteArticleFailure = createAction('DELETE_ARTICLE_FAILURE', error => ({ error }))

export const newUserTextRequested = createAction('NEW_USER_TEXT_REQUEST', (item, text) => ({ item, text }))
export const newUserTextSuccess = createAction('NEW_USER_TEXT_SUCCESS', data => ({ data }))
export const newUserTextFailure = createAction('NEW_USER_TEXT_FAILURE', error => ({ error }))

export const userTextApproveRequested = createAction('USER_TEXT_APPROVE_REQUEST', data => ({ data }))
export const userTextApproveSuccess = createAction('USER_TEXT_APPROVE_SUCCESS', data => ({ data }))
export const userTextApproveFailure = createAction('USER_TEXT_APPROVE_FAILURE', error => ({ error }))

const reducer = handleActions({
    [articleUrlChanged]: (state, action) => ({
        ...state,
        url: action.payload.url,
    }),
    [articleRequested]: (state, action) => ({
        ...state,
        articleData: RemoteData.Loading,
    }),
    [articleSuccess]: (state, action) => ({
        ...state,
        articleData: RemoteData.Succeeded(action.payload.data),
    }),
    [articleFailure]: (state, action) => ({
        ...state,
        articleData: RemoteData.Failed(action.payload.error),
    }),

    [allArticlesRequested]: (state, action) => ({ ...state, allArticlesData: RemoteData.Loading }),
    [allArticlesSuccess]: (state, action) => ({ ...state, allArticlesData: RemoteData.Succeeded(action.payload.data) }),
    [allArticlesFailure]: (state, action) => ({ ...state, allArticlesData: RemoteData.Failed(action.payload.error) }),

    [deleteArticleRequested]: (state, action) => ({ ...state }),
    [deleteArticleSuccess]: (state, action) => ({
        ...state,
        allArticlesData: RemoteData.Succeeded(state.allArticlesData.data.filter(article => article._id !== action.payload.id )),
    }),
    [deleteArticleFailure]: (state, action) => ({ ...state }),

    [newUserTextRequested]: (state, action) => ({
        ...state,
        editedPharagraph: action.payload.item,
        newUserTextError: '',
    }),
    [newUserTextSuccess]: (state, action) => ({
        ...state,
        editedPharagraph: {},
        newUserTextError: '',
    }),
    [newUserTextFailure]: (state, action) => ({
        ...state,
        newUserTextError: action.payload.error,
        editedPharagraph: {},
    }),

    [userTextApproveRequested]: (state, action) => ({ ...state }),
    [userTextApproveSuccess]: (state, action) => { //bad code, fix me later
        const index = _.findIndex(state.allArticlesData.data, { _id: action.payload.data._id })
        const updatedArticlesData = state.allArticlesData.data;
        updatedArticlesData[index] = action.payload.data

        return {
            ...state,
            allArticlesData: RemoteData.Succeeded(updatedArticlesData),
        }
    },
    [userTextApproveFailure]: (state, action) => ({ ...state }),
}, initialState)

export default reducer

function* articleRequest() {
    try {
        const url = (yield select(takeArticleUrl)).trim()
        if (url === '') {
            yield put(articleFailure('Please, enter article url.'))
            return
        }
        addQuery({ articleUrl: encodeURI(url) })
        const apiResult = yield call(api.article, url)
        yield put(articleSuccess(apiResult.resp))
    } catch (error) {
        if (error.status === 200)
            yield put(articleFailure(error.data.error))
        else
            yield put(articleFailure('Something unexpected happened, please try again.'))
    }
}

function* allArticlesRequest(action) {
    try {
        const showApproved = action.payload.query
        const apiResult = yield call(api.allArticles, showApproved)
        yield put(allArticlesSuccess(apiResult.resp))
    } catch (error) {
        if (error.status === 200)
            yield put(allArticlesFailure(error.data.error))
        else
            yield put(allArticlesFailure('Something unexpected happened, please try again.'))
    }
}

function* deleteArticle(action) {
    try {
        const { id } = action.payload
        const apiResult = yield call(api.deleteArticles, id)
        yield put(deleteArticleSuccess(apiResult.resp))
    } catch (error) {
        if (error.status === 200)
            yield put(deleteArticleFailure(error.data.error))
        else
            yield put(deleteArticleFailure('Something unexpected happened, please try again.'))
    }
}

function* newUserTextRequest(action) {
    try {
        const newText = action.payload.text
        const pharagraph = action.payload.item
        const sendData = {
            _id: pharagraph._id,
            url: pharagraph.url,
            newText: newText,
        }
        const pharagraphResult = yield call(api.sendUserText, sendData)
        yield put(newUserTextSuccess(pharagraphResult))
    } catch (error) {
        if (error.status === 200)
            yield put(newUserTextFailure(error.data.error))
        else
            yield put(newUserTextFailure('Something unexpected happened, please try again.'))
    }
}

function* userTextApproveRequest(action) {
    try {
        const apiResult = yield call(api.approveUserText, action.payload.data)
        console.log()
        if (apiResult.resp)
            yield put(userTextApproveSuccess(apiResult.resp))
        else
            yield put(newUserTextFailure(apiResult.error))
    } catch (error) {
        if (error.status === 200)
            yield put(newUserTextFailure(error.data.error))
        else
            yield put(newUserTextFailure('Something unexpected happened, please try again.'))
    }
}

export function* articlesSaga() {
    yield takeLatest(articleRequested, articleRequest)
    yield takeLatest(allArticlesRequested, allArticlesRequest)
    yield takeEvery(newUserTextRequested, newUserTextRequest)
    yield takeEvery(deleteArticleRequested, deleteArticle)
    yield takeEvery(userTextApproveRequested, userTextApproveRequest)
}
