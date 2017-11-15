import mongoose from '../db'
import ArticleModel from '../schema/article'

const ObjectID = mongoose.Types.ObjectId

export const all = (showApproved) => {
    const query = {
        'pharagraphs.usersText.isApproved': showApproved,
    }
    return ArticleModel.find(query)
}

export const takeOneArticle = url => ArticleModel.findOne({ url: url })

export const add = (data) => {
    const newArticle = ArticleModel(data)
    return newArticle.save()
}

export const removeArticle = id => ArticleModel.remove({ _id: ObjectID(id) })

export const approveUserText = (id, status) =>
    ArticleModel.findOne({ 'pharagraphs.usersText._id': ObjectID(id) })
        .then((article) => {
            let wasUpdated = false
            article.pharagraphs.forEach((pharagraph) => {
                const userTextToApprove = pharagraph.usersText.filter(userText => userText._id.toString() === id.toString())
                if (userTextToApprove.length) {
                    userTextToApprove[0].isApproved = status
                    wasUpdated = true
                }
            })
            if (wasUpdated)
                return article.save()
            else
                return Promise.reject(article)
        })
        .catch((error) => {
            console.log(error)
            return Promise.reject(error)
        })
