import { userModel } from "../../../DB/model/user.model.js";
import {messageModel} from '../../../DB/model/message.model.js'
import bcryptjs from "bcryptjs";
export const getInfo = async (req, res) => {
  let userMessages = await messageModel.find({receiverId: req.user._id})
  res.json({ message: "user", userMessages });
};


export const updatePassword = async (req, res) => {
  let { currentPassword, newPassword, newCPassword } = req.body;
  if (newPassword == newCPassword) {
    let user = await userModel.findById(req.user._id);
    let matched = await bcryptjs.compare(currentPassword, user.password);
    if (matched) {
      let hashedPass = await bcryptjs.hash(newPassword, parseInt(process.env.saltRound));
     let updatedUser =  await userModel.findByIdAndUpdate(user._id, {password:hashedPass},{new:true})
      res.json({ message: "updated", updatedUser });
  
    } else {
      res.json({message:"current password invalid"})
    }
  } else {
    res.json({ message: "newPassword must equal to newCPassword" });
  }
}


export const profilePic= (req,res) =>{
  console.log(res.file);
  res.json({message:"done"})
}