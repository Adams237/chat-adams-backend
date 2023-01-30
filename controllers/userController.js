const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { find } = require('../models/userModel')


module.exports.login = async(req,res,next)=>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.json({error:"email ou mot de passe incorrect", status:false})
        }
        const verifyPasswor = await bcrypt.compare(password, user.password)
        if(!verifyPasswor){
            return res.json({error:"email ou mot de passe incorrect", status:false})
        }
        delete user.password
        return res.json({status:true, user})
    }catch(ex){
        next(ex)
    }
}
module.exports.register = async(req,res,next)=>{
  try{
    const { userName, email, password } = req.body
    const checkUser = await User.findOne({email})
    if(checkUser){
     return res.json({msg:"cette amail est déjà utilis", status:false})
    }
    const crypPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
     userName,
     email,
     password: crypPassword
    })
    delete user.password
    return res.json({status:true, user})
  }catch(ex){
    next(ex)
  }
}
module.exports.setAvatar = async(req, res, next)=>{
    try{
        const userId = req.params.id;
        // console.log(userId);
        const avatarImage = req.body.image
        const user = await User.findByIdAndUpdate(userId,{
            isAvatarImagesSet:true,
            avatarImage,
        })
        return res.json({isSet:user.isAvatarImagesSet, image:user.avatarImage})
    }catch(ex){
        next(ex)
    }
}

module.exports.getAllUsers = async(req,res,next)=>{
    try{
        const users = await User.find({_id: { $ne:req.params.id}}).select([
            "email",
            "avatarImage",
            "userName",
            "_id"
        ])
        return res.json(users)
    }catch(ex){
        next(ex)
    }
}