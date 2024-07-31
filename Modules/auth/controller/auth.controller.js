import { userModel} from '../../../DB/model/user.model.js'
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendToEmail } from "../../../service/sendEmail.js";
import { nanoid } from "nanoid";


export const signUp =async (req, res) => {
       const { userName, email, password, cPassword } = req.body;
       if (password == cPassword) {
         const foundedUser = await userModel.findOne({ email });
         if (foundedUser) {
           res.json({ message: "you're already register " });
         } else {
             let hashed = await bcryptjs.hash(password, parseInt(process.env.saltRound));
             let user = new userModel({ userName, email, password: hashed })
           let savedUser = await user.save();
           let token = jwt.sign({ id: savedUser._id }, process.env.JWTEMAILKEY, { expiresIn: 60 });
           let refreshToken = jwt.sign({ id: savedUser._id }, process.env.JWTEMAILKEY, { expiresIn: 60* 60 });
           console.log(req);
          //  let URL = `${req.protocol}://`
           let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">please click here to verfy your email</a>
          <br>
          <br>
          <a href="http://localhost:3000/api/v1/auth/refreshToken/${refreshToken}">please click to refreshToken</a>
           `;
           sendToEmail(email, message);
            res.json({ message: "added", savedUser });
         }
       } else {
         res.json({ message: "password should match cPassword " });
       }
}



export const signIn = async (req, res) => {
  const { email, password } = req.body;
    const foundedUser = await userModel.findOne({ email });
    if (foundedUser) {
        let matched = await bcryptjs.compare(password, foundedUser.password);
      if (matched) {
        if (foundedUser.confirmEmail) {
              let token = jwt.sign({ isLogin: true, id: foundedUser._id }, process.env.JWTKEY);
              res.json({ message: "welocme", foundedUser, token });
        } else {
            res.json({ message: "please confrim your email first" });
          }
          
        } else {
              res.json({ message: "password in-correct" });
        }
    } else {
      res.json({ message: "you have to register first or confirm the email" });
    }
};

export const confirmEmail = async(req, res) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.JWTEMAILKEY);
  if (decoded) {
    console.log(decoded);
    let user = await userModel.findOne({ _id: decoded.id, confirmEmail: false });
    if (user) {
      let udpatedUser = await userModel.findByIdAndUpdate(decoded.id, { confirmEmail: true }, {new:true});
      res.json({ message: "updated", udpatedUser });
    } else {
        res.json({ message: "you're already confirmed or invalid token" });
    }
  } else {
      res.json({ message: " invalid token" });
   }
  
  

}

export const refreshToken = async(req, res) => {
  let { token } = req.params
  let decoded = jwt.verify(token, process.env.JWTEMAILKEY);
  if (!decoded || !decoded.id) {
    res.json({message:"invalid token or id"})
  } else {
    let user = await userModel.findById(decoded.id);
    if (!user) {
      res.json({message:"user didn't register"})
    } else {
      if (user.confirmEmail) {
        res.json({message:"already confirmed"})
      } else {
          let token = jwt.sign({ id: user._id }, process.env.JWTEMAILKEY);
       let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">this is the second email</a>`;
       sendToEmail(user.email, message);
       res.json({ message: "Done please check you email" });
      }
    }
  }
}

export const sendCode = async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    res.json({message:"user didn't register yes"})
  } else {
    // let OTPCode = Math.floor(Math.random() * (1999 - 1940 + 1) + 1940);
    let OTPCode = nanoid()

    console.log(OTPCode);
    await userModel.findByIdAndUpdate(user._id,{code:OTPCode})
      let message = `your OTPCODE is ${OTPCode}`;
      sendToEmail(user.email, message);
      res.json({ message: "Done please check you email" });

  }
}


export const forgetPassword = async (req, res) => {
  try {
    let { code, email, password } = req.body;
    if (!code) {
      res.json({ message: " code is not valid" });
    } else {
      let user = await userModel.findOne({ email, code });
      if (!user) {
        res.json({ message: "email or code is not valid" });
      } else {
        const hashPass = await bcryptjs.hash(password, parseInt(process.env.saltRound));
        let update = await userModel.findByIdAndUpdate(user._id, { code: null, password: hashPass }, { new: true });
        res.json({ message: "success", update });
      }
    }
  } catch (error) {
        res.json({ message: " error", error });
  }
  
}