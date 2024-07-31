import mongoose from 'mongoose';


export const connection = async() => {
    return await mongoose
      .connect(process.env.DB_CONNECTION)
      .then(() => {
        console.log("connected");
      })
      .catch(() => {
        console.log("error");
      });
}