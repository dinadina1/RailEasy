// require necessary packages
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  registerAuthUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  userProfile,
  newUser,
  getAllUsers,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
  googleLogin,
} = require("../controllers/authController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

// upload image using multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
      file.uniqueSuffix = uniqueSuffix;
    },
  }),
});

// auth routes
router.route("/register").post(upload.single("avatar"), registerAuthUser);
router.route("/login").post(loginUser);
router.route("/login/google").post(googleLogin);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/profile").get(isAuthenticatedUser, userProfile);
router
  .route("/user/:id")
  .put(isAuthenticatedUser, upload.single("avatar"), updateUser);
router.route("/user/password/:id").put(isAuthenticatedUser, changePassword);

// admin routes
router
  .route("/admin/user/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles(["admin"]),
    upload.single("avatar"),
    newUser
  );
router
  .route("/admin/users")
  .get(
    isAuthenticatedUser,
    authorizeRoles(["admin"]),
    upload.single("avatar"),
    getAllUsers
  );
router
  .route("/admin/user/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles(["admin"]),
    upload.single("avatar"),
    getUser
  );
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles(["admin"]), deleteUser);

// export router
module.exports = router;
