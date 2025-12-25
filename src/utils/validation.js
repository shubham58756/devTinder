const validator = require("validator");
const validateSignUpData = (req) => { 
  const errors = {firstName: [], lastName: [], email: [], password: [], age: []}= req.body ;
  if(!firstName || !lastName) {
    throw new Error("First name is not valid"); 

  }

  else if(firstName.length < 4 || firstName.length > 50){
    throw new Error("First name must be between 4 and 50 characters");
  }
    else if(!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password));{
        throw new Error("Please enter a strong password");
    }
    
    };
    module.exports = {validateSignUpData};