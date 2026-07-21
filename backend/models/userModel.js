import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
)

userSchema.methods.matchPassword = async function (entererdPassword) {
    return await bcrypt.compare(entererdPassword, this.password)
}

const userModel = mongoose.model('userModel', userSchema, 'users')
export default userModel
