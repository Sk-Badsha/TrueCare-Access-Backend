import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/SendEmail.js";
import JobOpeningEmail from "../utils/SendEmail/JobOpeningEmail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { logging_v2 } from "googleapis";
const router = Router();

router.post(
  "/job-opening",
  asyncHandler(async (req, res) => {
    try {
      console.log(req.body);
      const email = await sendEmail(
        "badshabhota@gmail.com",
        "New Opening for You",
        JobOpeningEmail(
          req.body.companyName,
          req.body.openingFor,
          req.body.whomToContact.whomToContactName,
          req.body.whomToContact.whomToContactProfileUrl,
          req.body.applyLink
        )
      );
      res
        .status(201)
        .json(
          new ApiResponse(201, "Email send successfully to your gmail", email)
        );
    } catch (error) {
      throw new ApiError(504, "Something went wrong", error);
    }
  })
);

export default router;
