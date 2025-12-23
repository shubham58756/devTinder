export const adminAuth = (req, res, next) => {
  console.log("admin auth middleware called");

  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};
export const userAuth = (req, res, next) => {
  console.log("user auth middleware called");

  const token = "xyz";
  const isUserAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};
module.exports={
    adminAuth,
    userAuth,
}