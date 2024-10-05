import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_schema.js";
import { Doctor } from "../models/doctor_schema.js";
import { Appointment } from "../models/appointment_schema.js";
const getDoctorInfo = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId }).select(
      "-password"
    );
    res
      .status(200)
      .json(new ApiResponse(200, "Doctor data fetched successfully", doctor));
  } catch (error) {
    console.log(error);

    throw new ApiError(505, "Error while getting doctor info", error);
  }
});

const updateDoctorInfo = asyncHandler(async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    ).select("-password");

    res
      .status(201)
      .json(new ApiResponse(201, "Doctor Updated Successfully", updatedDoctor));
  } catch (error) {
    console.log(error);
    throw new ApiError(505, "Error while updating doctor info");
  }
});

const getDoctorDetailsByID = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    if (!doctor) {
      throw new ApiError(404, "Error while getting doctor details");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, "Doctor details fetched successfully", doctor)
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      501,
      "Something went wrong while getting doctor by ID",
      error
    );
  }
});

const doctorAppointments = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    }).populate("userInfo", "name email");
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

const changeBookingStatus = asyncHandler(async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status,
      },
      { new: true }
    )
      .populate("doctorInfo", "lastName")
      .select("-password");

    const user = await User.findById(appointment.userId);
    const notification = user.notification;

    notification.push({
      type: `doctor-appointment-request`,
      message: `Your appointment request for Dr.${appointment?.doctorInfo?.lastName} on ${appointment.time} has been ${status}`,
      data: {
        onClickPath: "/user/appointments",
      },
    });
    await User.findByIdAndUpdate(user._id, {
      notification,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, ` Appointment has been ${status}`, appointment)
      );
  } catch (error) {
    res.send(505, "error while changing account status", error);
  }
});
export {
  getDoctorInfo,
  updateDoctorInfo,
  getDoctorDetailsByID,
  doctorAppointments,
  changeBookingStatus,
};
