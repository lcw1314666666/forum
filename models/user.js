const mongoose = require('mongoose')


const Schema = mongoose.Schema

//连接数据库
mongoose.connect('mongodb://localhost/user', { useMongoClient: true })


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    last_modifed_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: './public/img/avatar-default.png'
    },
    bio: {
        type: String,
        default: ''
    },
    genter: {
        type: Number,
        default: -1,
        enum: [-1, 0, 1]
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2]
    }
})


module.exports = mongoose.model('User', userSchema)