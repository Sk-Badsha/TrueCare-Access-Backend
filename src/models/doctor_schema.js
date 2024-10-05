import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Contact Number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    specializationOn: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: Number,
    },
    feesPerConsultation: {
      type: Number,
      required: [true, "Fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "Work time is required"],
    },
  },
  { timestamps: true }
);
export const Doctor = mongoose.model("Doctor", doctorSchema);
