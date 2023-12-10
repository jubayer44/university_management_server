import { Schema, model } from "mongoose";
import { TAdmin, TUserName } from "./admin.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    maxlength: [10, "First Name can't be more then 10 characters"],
    required: [true, "First Name is required"],
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
});

const adminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

adminSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
adminSchema.pre("findOne", async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("aggregate", async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating mongoose virtual field
adminSchema.virtual("fullName").get(function () {
  return `${
    this?.name?.firstName
  } ${this?.name?.middleName ? this?.name?.middleName : ""} ${this?.name?.lastName}`;
});

//// creating a custom instance
adminSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model<TAdmin>("Admin", adminSchema);
