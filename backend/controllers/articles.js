import * as ArticleModel from '../models/articles'
import { parseArticleFromUrl } from '../common'

export const all = (req, res) => {
    const { showApproved } = req.query

    ArticleModel.all(showApproved)
        .then(data => res.status(200).send({ resp: data }))
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
}

export const getArticle = (req, res) => {
    const url = req.query.articleURL
    if (url.indexOf('https://www.dagbladet.no') === 0) {
        ArticleModel.takeOneArticle(url)
            .then((article) => {
                if (article) {
                    res.status(200).send({ resp: article })
                } else {
                    parseArticleFromUrl(url)
                        .then((newArticle) => {
                            ArticleModel.add(newArticle)
                                .then(data => res.status(200).send({ resp: data }))
                                .catch((error) => {
                                    res.status(500).send(error)
                                })
                        })
                        .catch((error) => {
                            if (error.status === 200)
                                res.status(200).send(error)
                            else
                                res.status(500).send(error)
                        })
                }
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send(error)
            })
    } else {
        return res.status(200).send({ error: 'Invalid URL. URL domain should start with - https://www.dagbladet.no' })
    }
}

export const addUserText = (req, res) => {
    const data = req.body

    ArticleModel.takeOneArticle(data.url)
        .then((article) => {
            if (article) {
                const pharagraph = article.pharagraphs.find(item => data._id.toString() === item._id.toString())
                pharagraph.usersText.push({
                    text: data.newText,
                    isApproved: false,
                })
                article.save()
                    .then(() => res.sendStatus(200))
                    .catch(error => res.status(500).send(error))
            } else {
                res.status(500).send({ error: 'Error: Article not find.' })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
}

export const deleteArticle = (req, res) => {
    const { id } = req.params

    ArticleModel.removeArticle(id)
        .then(() => res.status(200).send({ resp: id }))
        .catch(error => res.status(500).send(error))
}

export const approveUserText = (req, res) => {
    const data = req.body

    ArticleModel.approveUserText(data.id, data.status)
        .then(newArticle => res.status(200).send({ resp: newArticle }))
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
}
