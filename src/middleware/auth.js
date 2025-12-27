const adminAuth = (req, res, next) => {
  console.log("admin auth middleware called")

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "")
  const isAdminAuthorized = token === "xyz"

  if (!isAdminAuthorized) {
    return res.status(401).send("unauthorized request")
  }
  next()
}

const userAuth = (req, res, next) => {
  console.log("user auth middleware called")

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "")
  const isUserAuthorized = token === "xyz"

  if (!isUserAuthorized) {
    return res.status(401).send("unauthorized request")
  }
  next()
}

module.exports = {
  adminAuth,
  userAuth
}