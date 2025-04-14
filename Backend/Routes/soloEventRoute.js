import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { registered } from "../controller/soloEventController.js";

const router = express.Router();

router.post("/participate/:id",isAuthenticated,registered);


export default router;