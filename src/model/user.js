const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2
    },
    lastName: {
      type: String,
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please enter a valid email address"
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
      validate: {
        validator: (value) => !value.toLowerCase().includes("password"),
        message: "Password should not contain 'password'"
      }
    },
    age: {
      type: Number,
      min: 18
    },
    gender: {
      type: String,
      validate(value) {
        if(!"male","female","other".includes(value.toLowerCase())) {
          throw new Error("Invalid gender")
        }
      }
    },
    photoURL: {
      type: String,
      default: "abcd"
    },
    about: {
      type: String,
      default: "This is the default value"
    },
    skills: {
      type: [String]
    }
  },
  { timestamps: true }
)

userSchema.methods.JWTtoken = async function() {

  const User = this;
  const token = await jwt.sign({ _id: this._id }, "DEV@Tinder$790", { expiresIn: '7d',

   })
  return token;
};
userSchema.method.validatePassword = async function(password) {
  const user = this;
  const passwordHash=user.password;
  const isValid = await bcrypt.compare(password, passwordHash);
  passwordHash
  return isValid;
} 

module.exports = mongoose.model("User", userSchema)
