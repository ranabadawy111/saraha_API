import jwt from 'jsonwebtoken'
import  {userModel}  from '../DB/model/user.model.js';

export const auth = () => {
    return async (req, res, next) => {
   
        let { authorization } = req.headers
        if (authorization && authorization.startsWith('Bearer')) {
            let token = authorization.split(" ")[1];
            let verfied = jwt.verify(token, process.env.JWTKEY);
            if (verfied) {
                let user = await userModel.findById(verfied.id);
                if (user) {
                    req.user = user;
                    next()
                } else {
                    res.json({message:"invalid user"})
                }
            } else {
                res.json({message:"invlid token"})
            }
        } else {
               res.json({ message: "invlid token or not send" });
        }
    }
}