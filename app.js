import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import { connection } from './DB/connection.js';
import * as routes from './Modules/index.routes.js'
const app = express()
const port = 3000;
const baseURL = "/api/v1";
app.use(express.json())
app.use(`${baseURL}/user`, routes.userRoute);
app.use(`${baseURL}/auth`, routes.authRoute);
app.use(`${baseURL}/message`, routes.messageRoute);
connection();
app.get('/', (req, res) => res.send('Hello World!'))
app.get("*", (req, res) => {
    res.json({message:"invalid api"})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))