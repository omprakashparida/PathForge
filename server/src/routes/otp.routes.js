import express from "express";

import {sendSignupOTP,verifySignupOTP,resendOTP,sendForgotOTP, verifyForgotOTP,resetPassword} from "../controllers/otp.controller.js";

const router=express.Router();

router.post("/send-signup-otp",sendSignupOTP);
router.post("/verify-signup-otp",verifySignupOTP);
router.post("/resend-otp",resendOTP);
router.post(    "/forgot-password",sendForgotOTP);  
router.post(    "/verify-forgot-otp",verifyForgotOTP);
router.post("/reset-password",resetPassword);
export default router;