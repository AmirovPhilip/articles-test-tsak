import { browserHistory } from 'react-router';

/**
 * @param {Object} query
 */
export const addQuery = (query) => {
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    Object.assign(location.query, query);
    browserHistory.push(location);
};
/**
 * @param {Object} query
 */
export const updateEntireQuery = (query) => {
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    location.query = query
    browserHistory.push(location);
}
/**
 * @param null
 */
export const clearQuery = () => {
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    location.query = {}
    browserHistory.push(location);
}

/**
 * @param {...String} queryNames
 */
export const removeQuery = (...queryNames) => {
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    queryNames.forEach(q => delete location.query[q]);
    browserHistory.push(location);
}
/**
 * @param {String} queryNames
 */
export const getQuery = (queryNames) => {
    const value = browserHistory.getCurrentLocation().query[queryNames]
    return value || false
}
