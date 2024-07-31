import { messageModel } from '../../../DB/model/message.model.js';
import { userModel } from "../../../DB/model/user.model.js";


export const addMessage = async(req, res) => {
try {
        let { receiverId } = req.params;
        let { text } = req.body;
        let foundedUser = await userModel.findById(receiverId);
        if (foundedUser) {
          let addMes = new messageModel({ text, receiverId });
          let added = await addMes.save();
          res.json({ message: "added", added });
        } else {
          res.json({ message: "receiverId is incorrect" });
        }
} catch (error) {
     res.json({ error });
}

}