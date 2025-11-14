const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "Unauthorized, No token" });
  try {
    const id = jwt.verify(token, process.env.JWT_SECRET).id;
    req.user = await User.findById(id).select("-password");
    next();
  } catch (e) {
    console.log(e)
    return res.status(400).json({ msg: "Not a valid token" });
  }
};

module.exports = auth;
