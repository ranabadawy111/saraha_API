import { Router } from "express";
import { addMessage } from "./controller/messsages.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "messages" });
});

router.post("/addMessage/:receiverId", addMessage)

export default router;
