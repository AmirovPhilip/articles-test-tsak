import axios from 'axios'

const prefix = 'api/'
const baseURL = `/${prefix}`

let store = null //eslint-disable-line

export const apiMiddleware = (reduxStore) => {
    store = reduxStore
    return next => (action) => {
        next(action)
    }
}

const interceptMainConfig = (config) => {
    const headers = config.headers //eslint-disable-line
    headers['Content-Type'] = 'application/json;charset=UTF-8'

    config.headers = { ...config.headers } //eslint-disable-line no-param-reassign
    return config;
}

const getAxiosConfig = () => ({ baseURL })

const instances = {
    _main: null,

    get main() {
        if (!this._main) {
            this._main = axios.create(getAxiosConfig())

            this._main.interceptors.request.use(
                interceptMainConfig,
                Promise.reject,
            )

            this._main.interceptors.response.use(
                (response) => {
                    if (response.data.error)
                        return Promise.reject(response)
                    return response.data
                },
                error => Promise.reject(error),
            )
        }
        return this._main
    },
}

export const article = url => instances.main.get(`article?articleURL=${url}`)

export const allArticles = showApproved => instances.main.get(`articles?showApproved=${showApproved}`)

export const deleteArticles = id => instances.main.delete(`article/${id}`)

export const sendUserText = data => instances.main.post('article/addUserText', data)

export const approveUserText = data => instances.main.post('pharagraph/approve', data)
