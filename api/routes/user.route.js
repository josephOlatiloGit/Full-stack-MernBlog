import express from "express";
import {
  text,
  updateUser,
  deleteUser,
  signOut,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", text);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signOut);
router.get("/getusers", verifyToken, getUsers);
// router.delete("/deleteusers", verifyToken, deleteUser);

export default router;
