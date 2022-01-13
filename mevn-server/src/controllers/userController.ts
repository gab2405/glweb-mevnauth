import { Request, Response } from 'express';
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const mailController = require('./mailController');

const signToken = (user: {
  email: string;
  password: string;
}) => {
  return JWT.sign({
    iss: process.env.JWT_ISS,
    sub: user.email,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day
  }, JWT_SECRET);
}

module.exports = {
  /**
   * Register a new user
   * @param {e.Request} req
   * @param {e.Response} res
   * @returns {Promise<e.Response<any, Record<string, any>>>}
   */
  register: async (req: Request, res: Response) => {
    const {
      email,
      password,
      name
    } = req.body;
    // Check if there is a user with the entered email
    const foundUser = await User.findOne({
      "local.email": email
    });
    if (foundUser) {
      return res.status(403).json({
        error: 'Email is already in use'
      });
    }

    // Create a new user
    const newUser = new User({
      name,
      method: 'local',
      local: {
        email: email,
        password: password
      },
      emailConfirmed: false,
      status: 'eMailConfirmation',
      dates: {
        registered: new Date()
      }
    });

    // Generate a salt and hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newUser.local.password, salt);
    //save newUser with hashed password
    newUser.local.password = passwordHash;
    await newUser.save();
    console.log(newUser)
    // Generate a token and respond with it
    const token = signToken(newUser);
    mailController.sendConfirm(newUser._id);
    res.status(200).json({
      token
    });
  },

  /**
   * Login. This is called after the passport authentication is checked by the login route guard
   * @param {e.Request} req
   * @param {e.Response} res
   * @returns {Promise<void>}
   */
  login: async (req: Request, res: Response) => {
    // Generate a token and respond with it
    const token = signToken(req.body);
    res.status(200).json({
      token
    });
  },
  /**
   * Verify the users jwt token and respond with the user data
   * @param {e.Request} req
   * @param {e.Response} res
   * @returns {Promise<void>}
   */
  secret: async (req: Request, res: Response) => {
    res.json({
      secret: req.body
    });
  },
}