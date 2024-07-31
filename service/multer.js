import { json } from 'express';
import multer from 'multer';
import  { nanoid }  from 'nanoid';


export const HandleMulter=() => {
    return (err, req, res, next)=>{
        if(err){
            res.json({message:"invalid type"})
        } else {
            next();
        }
    }
}

export const myMulter= ()=> {
     const storage= multer.diskStorage({

        destination: function(req, file, cb) {
            cb(null, 'uploads')
        },
    
    
        filename: function(req, file, cb){
            console.log(MimeType);
            cb(null, nanoid()+"_"+file.originalname)
    
        }
    })
    function fileFilter(req, file, cb) {
if(file.MimeType== "image/png" || file.MimeType== "image/jpeg" || file.MimeType== "image/jpgg") {
    cb(null, true)
} else {
    cb("invalid image", false)
}

    }
    const upload= multer({ storage, dest:"/uploads", fileFilter });

    return upload;
}

