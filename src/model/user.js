const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

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
      match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

module.exports = mongoose.model("User", userSchema)
