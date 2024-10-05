import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_schema.js";
import { Doctor } from "../models/doctor_schema.js";
import { Appointment } from "../models/appointment_schema.js";
import { convertDateTimeToISOString } from "../utils/ConvertDateTime.js";
import { sendEmail } from "../utils/SendEmail.js";
import registrationSuccessEmail from "../utils/SendEmail/RegistrationSuccessEmail.js";
import PrankEmail from "../utils/SendEmail/PrankEmail.js";
import ResetPasswordEmail from "../utils/SendEmail/ResetPasswordEmail.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const acc_token = user.generateAccessToken();
    const ref_token = user.generateRefreshToken();

    user.refreshToken = ref_token;

    await user.save({ validateBeforeSave: false });
    return { acc_token, ref_token };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }
  if (!email.includes("@")) throw new ApiError(400, "Email is not valid");

  const existedUser = await User.findOne({
    $or: [{ email: req.body.email }],
  });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, "User with this email already exists", {}));
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // Select fields to return (excluding sensitive data)
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  await sendEmail(
    createdUser.email,
    "Thank you for Registering with US 📧 TrueCare Access",
    registrationSuccessEmail(createdUser.name)
  );
  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password)
    throw new ApiError(400, "username or email is required");

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) throw new ApiError(404, "User doesn't exists");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { acc_token, ref_token } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  };

  return res
    .status(200)
    .cookie("accessToken", acc_token, options)
    .cookie("refreshToken", ref_token, options)
    .json(
      new ApiResponse(200, "user logged in successfully", {
        user: loggedInUser,
        acc_token,
        ref_token,
      })
    );
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not exists");
  }

  const secret = process.env.JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "300s" });

  const link = `${process.env.FRONTEND_URL}/users/reset-password/${user._id}/${token}`;
  try {
    const result = await sendEmail(
      email,
      "Reset Password Request",
      ResetPasswordEmail(user.name, link)
    );
    if (result) {
      res
        .status(200)
        .json(new ApiResponse(200, "link sent successfully", link));
    } else {
      throw new ApiError(505, "error while sending email");
    }
  } catch (error) {
    console.log(
      "Error sending email:",
      error.response ? error.response.body : error
    );
    throw new ApiError(
      502,
      "Email could not be sent, Please try after sometime"
    );
  }
});

const getResetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOne({ _id: req.params.id });

  if (user) {
    const secret = process.env.JWT_SECRET + user.password;
    try {
      const payload = jwt.verify(req.params.token, secret);
      // render a form
      res.status(200).json(new ApiResponse(200, "User & token is verified"));
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  } else {
    res.send({ message: "hi" });
    return;
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(token, " ", id, " ", password);

  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    res.status(404).json(new ApiResponse(404, "User not valid"));
  }
  // we have a valid id & a valid user exist with this id
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(req.params.token, secret);
    user.password = password;
    await user.save({ validateBeforeSave: true });
    return res
      .status(200)
      .json(new ApiResponse(200, "password updated successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ApiResponse(505, "DB Problem..Error in UPDATE with id"));
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) throw new ApiError(401, "no current user available");

    return res
      .status(200)
      .json(new ApiResponse(200, "successfully got current user", currentUser));
  } catch (error) {
    console.log(error);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const applyDoctor = asyncHandler(async (req, res) => {
  const existedDoctor = await Doctor.findOne({
    userId: req.user._id,
  });

  if (existedDoctor) {
    throw new ApiError(404, "Doctor Already Applied");
  }

  const doctor = await Doctor.create({
    ...req.body,
    status: "pending",
  });

  if (!doctor) {
    throw new ApiError(404, "Error while creating doctor");
  }

  // Select fields to return (excluding sensitive data)
  const createdDoctor = await Doctor.findById(doctor._id).select("-password");

  if (!createdDoctor) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  const adminUser = await User.findOne({ isAdmin: true });
  const notification = adminUser.notification;
  notification.push({
    type: "apply-doctor-request",
    message: `${createdDoctor.firstName} ${createdDoctor.lastName} has applied for a doctor account`,
    data: {
      doctorID: createdDoctor._id,
      name: createdDoctor.firstName + " " + createdDoctor.lastName,
      onClickPath: "/admin/doctors",
    },
  });

  const response = await User.findByIdAndUpdate(adminUser._id, {
    notification,
  });

  if (!response) {
    await User.findByIdAndDelete(createdDoctor._id);
    throw new ApiError(500, "Something went wrong while applying doctor");
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, "Doctor Account Applied Successfully", createdDoctor)
    );
});

const getAllNotificationsByID = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select(
      "notification seenNotification"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Return notifications
    return res
      .status(200)
      .json(new ApiResponse(200, "Notifications fetched successfully", user));
  } catch (error) {
    console.error(error);
    throw new ApiError(505, "Error fetching notifications");
  }
});

const getAllNotification = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: { seenNotification: { $each: user.notification } },
        $set: { notification: [] },
      },
      { new: true } // Return the updated document
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(
        new ApiResponse(200, "all notification marked as read", updatedUser)
      );
  } catch (error) {
    throw new ApiError(500, "Error in notification", error);
  }
});

const deleteAllNotification = asyncHandler(async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: { notification: [], seenNotification: [] },
      },
      { new: true } // Return the updated document
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "all notification deleted successfully",
          updatedUser
        )
      );
  } catch (error) {
    throw new ApiError(500, "Unable to delete all notification", error);
  }
});

const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res
      .status(201)
      .json(
        new ApiResponse(201, "All Doctor data fetched successfully", doctors)
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(501, "Error while getting all doctors");
  }
});

const bookAppointment = asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      status: "pending",
      time: convertDateTimeToISOString(req.body.date, req.body.time),
    });
    if (!appointment) {
      throw new ApiError(500, "Error while booking appointment");
    }

    console.log("appointment: ", appointment);

    const doctor = await User.findByIdAndUpdate(req.body.doctorInfo.userId, {
      $push: {
        notification: {
          type: "new-appointment-request",
          message: `A new appointment request from ${req.body.userInfo.name} at ${req.body.time} on ${req.body.date}`,
          onClickPath: "/doctor/appointments",
        },
      },
    });

    const user = await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        notification: {
          type: "booking-for-doctor-appointment",
          message: `Your request to book an appointment for Dr. ${req.body.doctorInfo?.firstName} ${req.body.doctorInfo?.lastName} at ${req.body.time} on ${req.body.date} has been send to your doctor`,
          onClickPath: "/user/appointments",
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Appointment request send successfully",
          appointment
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(502, "Error while booking appointment");
  }
});

const bookingAvailability = asyncHandler(async (req, res) => {
  try {
    const userAppointmentStart = convertDateTimeToISOString(
      req.body.date,
      req.body.time
    );

    if (!userAppointmentStart) {
      throw new ApiError(404, "Invalid user date or time");
    }

    const doctorTimings = await Doctor.findById(req.body.doctorId);

    const doctorStartTime = convertDateTimeToISOString(
      req.body.date,
      doctorTimings.timings.start
    );
    const doctorEndTime = convertDateTimeToISOString(
      req.body.date,
      doctorTimings.timings.end
    );

    const appointmentDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    const userAppointmentEnd = new Date(
      userAppointmentStart.getTime() + appointmentDuration
    );

    const bufferTime = 5 * 60 * 1000; // 10 minutes

    if (
      userAppointmentStart < doctorStartTime ||
      userAppointmentEnd > doctorEndTime
    ) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Appointment time is outside of the doctor’s available hours",
            false
          )
        );
    }

    // Check for conflicting appointments
    const conflictingAppointments = await Appointment.find({
      doctorId: req.body.doctorId,
      date: req.body.date,
      time: {
        $gte: new Date(
          userAppointmentStart.getTime() - bufferTime - appointmentDuration
        ),
        $lte: new Date(
          userAppointmentEnd.getTime() + bufferTime + appointmentDuration
        ),
      },
    });

    if (conflictingAppointments.length > 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Appointment slot is already booked or too close to another appointment",
            false
          )
        );
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Appointment slot is available", true));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message, error);
  }
});

const userAppointments = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user._id,
    })
      .populate("doctorInfo", "firstName lastName specializationOn") // Select fields from Doctor model;
      .populate("userInfo", "name email");
    res
      .status(200)
      .json(
        new ApiResponse(200, "Appointments gets successfully", appointments)
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(502, "Error while getting all appointments");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const requestedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body
    ).select("-password");

    const updatedUser = await User.findById(requestedUser._id).select(
      "-password"
    );

    res
      .status(201)
      .json(new ApiResponse(201, "User Updated Successfully", updatedUser));
  } catch (error) {
    console.log(error);
    throw new ApiError(505, "Error while updating user info");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { password, newPassword } = req.body;

  if (!newPassword && !password)
    throw new ApiError(400, "password or newPassword is required");
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Wrong Password");

  user.password = newPassword;

  user.notification.unshift({
    type: "update-password",
    message: "Your password has been updated successfully",
    onClickPath: "/",
  });
  await user.save({ validateBeforeSave: true });
  return res
    .status(200)
    .json(new ApiResponse(200, "password updated successfully", user));
});

export {
  registerUser,
  loginUser,
  forgotPassword,
  getCurrentUser,
  logoutUser,
  applyDoctor,
  getAllNotificationsByID,
  getAllNotification,
  deleteAllNotification,
  getAllDoctors,
  bookAppointment,
  bookingAvailability,
  userAppointments,
  updateProfile,
  getResetPassword,
  resetPassword,
  changePassword,
};
