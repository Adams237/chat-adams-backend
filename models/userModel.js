const mongoose = require('mongoose')

const userScheme = mongoose.Schema({
    userName:{
        type: String,
        require: [true, "nom requi"],
        min: 4,
        max:50,

    },
    email:{
        type: String,
        require: true,
        unique: true,
        max: 100,
    },
    password:{
        type: String,
        require: true,
        min:8,
        max:100
    },
    isAvatarImagesSet:{
        type: Boolean,
        default: false,
    },
    avatarImage:{
        type: String,
        default: ""
    }
})



module.exports = mongoose.model("Users", userScheme)