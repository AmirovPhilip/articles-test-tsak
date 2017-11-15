import mongoose from 'mongoose'
import config from '../config'

mongoose.Promise = Promise

mongoose.connect(`mongodb://${config.db.host}/${config.db.name}`, {
    useMongoClient: true,
})

export default mongoose
