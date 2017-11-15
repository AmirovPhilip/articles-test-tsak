import { JSDOM } from 'jsdom'

export const makeArrayOfPharagraphs = (data, url) => {
    const result = []
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const obj = {
                url: url,
                originalText: data[key].textContent,
                isApproved: false,
            }
            result.push(obj)
        }
    }
    return result
}

export const parseArticleFromUrl = (url) => {
    return JSDOM.fromURL(url)
        .then((dom) => {
            const { document } = dom.window
            const pharagraphs = document.querySelectorAll('.article-entity .body-copy p')

            if (!pharagraphs.length)
                return Promise.reject({ status: 200, error: 'This article does not have pharagraphs.' })

            const articleData = {
                url: url,
                title: document.querySelector('.article-entity h1').textContent,
                subtitle: document.querySelector('.article-entity h2').textContent,
                pharagraphs: makeArrayOfPharagraphs(pharagraphs, url),
            }

            return Promise.resolve(articleData)

        })
        .catch((error) => {
            if (error.status === 200)
                return Promise.reject(error)
            else
                return Promise.reject({ status: 200, error: 'Invalid URL. Please try again.' })
        })
}
