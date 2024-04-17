const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const verifyRole = require("../middleware/authenticateMiddleware");

/**
 * @api {post} /api/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiBody {String} username User's username
 * @apiBody {String} email User's email
 * @apiBody {String} phone User's phone number
 * @apiBody {String} password User's password
 * @apiBody {String} role User's role [manager, waiter, chef]
 *
 *
 * @apiSuccess {String} message User added successfully!
 * @apiError {String} message An error occurred!
 *
 *  @apiExample {json} Example usage:
 * {
 * "username": "John Doe",
 * "email": "",
 * "phone": "0712345678",
 * "password": "password",
 * "role": "manager"
 * }
 */
router.post("/register",verifyRole(['manager']), AuthController.register);

/**
 * @api {post} /api/auth/login Login a user
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * 
 * @apiBody {String} username User's username, email or phone
 * @apiBody {String} password User's password
 * 
 * @apiSuccess {String} message User logged in successfully!
 * @apiError {String} message An error occurred!
 * 
 */
router.post("/login", AuthController.login);

/**
 * @api {post} /api/auth/refresh-token Refresh user token
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} message Token refreshed successfully!
 * @apiError {String} message An error occurred!
 * 
 */
router.post("/refresh-token", AuthController.refreshToken);

/**
 * @api {get} /api/auth/get-user Get all users
 * @apiName GetUsers
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} message Users fetched successfully!
 * @apiError {String} message An error occurred!
 * 
 */
router.get("/users", AuthController.getUsers);

module.exports = router;
