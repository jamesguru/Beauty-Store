import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
    },

    password: {
      type: String,
      require: true,
    },

    address: {
      type: String,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
    },

    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
