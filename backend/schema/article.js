import mongoose from '../db'

const { Schema } = mongoose

const ArticleSchema = new Schema({
    url: {
        type: String,
        unique: true,
        require: true,
        validate: {
            validator: text => text.indexOf('https://www.dagbladet.no') === 0,
            message: 'Invalid URL. URL domain should start with - https://www.dagbladet.no',
        },
    },
    title: {
        type: String,
    },
    subtitle: {
        type: String,
    },
    pharagraphs: {
        type: [{
            url: { type: String },
            originalText: { type: String },
            usersText: [{
                text: { type: String },
                isApproved: { type: Boolean },
            }],
        }],
    },
})

export default mongoose.model('ArticleModel', ArticleSchema);
