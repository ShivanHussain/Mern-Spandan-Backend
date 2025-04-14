import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { addParticipate, registered } from "../controller/groupEventController.js";

const router = express.Router();

router.post("/participate/:id",isAuthenticated,registered);
router.post("/add/:id",isAuthenticated,addParticipate);


export default router;