const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require("../controllers/auth.controller")

// For now, let's just create a placeholder controller
// const authController = {
//   registerUser: (req, res) => res.send('Registering user...'),
// };

const registrationRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('username').notEmpty().withMessage('Username is required'),
];

// Define the route, applying the validation rules as middleware
router.post('/register', registrationRules, authController.registerUser);
router.get('/practice-token', authController.practiceTokenGeneration)
router.post("/login", authController.loginUser)
module.exports = router;