import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo DB connected: ${conn.connection.host}`.cyan.bold)
    } catch (error) {
        console.error(`Error : ${error.message}`.red)
        process.exit(1)
    }
}
export default connectDB
