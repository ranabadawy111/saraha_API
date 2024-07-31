import { Router } from "express";
import { validation } from "../../midleware/validation.js";
import { signUpSchema } from "./auth.validation.js";

import { signUp, signIn, confirmEmail, refreshToken, sendCode, forgetPassword } from "./controller/auth.controller.js";
const router = Router();

router.post("/signup", validation(signUpSchema), signUp);
router.post("/signin", signIn);
router.get("/confirmEmail/:token", confirmEmail);
router.get("/refreshToken/:token", refreshToken)

router.post("/sendCode", sendCode)
router.post("/forgetPassword", forgetPassword);


export default router;
