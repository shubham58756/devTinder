const jwt = require("jsonwebtoken");
const User = require("../model/user");
const userAuth = async(req, res, next) => {
//reade the tokern from cookies and find the user

try{
  const {token} = req.cookies;
  if(!token) {
    throw new Error ("Token is npt valid");
  }
 const decodedObj= await jwt.verify (token, "DEV@Tinder$790");
 
 const {_id} = decodedObj;
 const user = await User.findById(_id);
 if(!user) {
  throw new Error ("User does not exist");
 }
 req.user = user; 
next();}
catch (err) {
  res.status(400).send("ERROR: "+ err.message);
}
}

module.exports = { 
  adminAuth,
  userAuth
};