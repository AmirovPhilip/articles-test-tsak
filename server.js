import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import config from './backend/config'

import * as articlesController from './backend/controllers/articles'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/fb', express.static(path.join(__dirname, './')))


app.get('/api/article', articlesController.getArticle)

app.get('/api/articles', articlesController.all)

app.delete('/api/article/:id', articlesController.deleteArticle)

app.post('/api/article/addUserText', articlesController.addUserText)

app.post('/api/pharagraph/approve', articlesController.approveUserText)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})
