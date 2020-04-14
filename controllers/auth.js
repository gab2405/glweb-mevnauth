const JWT = require('jsonwebtoken');
const JWS = require('jwt-simple');
const User = require('../models/auth');
const {
  JWT_SECRET,
  JWS_SECRET
} = require('../config');
const bcrypt = require('bcryptjs');
const mail = require('./mail');

signToken = user => {
  return JWT.sign({
    iss: 'GLB2B',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day
  }, JWT_SECRET);
}

module.exports = {
  register: async (req, res, next) => {
    const {
      email,
      password,
      name
    } = req.value.body;
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
    // Generate a token and respond with it
    const token = signToken(newUser);
    mail.sendConfirm(newUser._id);
    res.status(200).json({
      token
    });
  },

  resend: async (req, res, next) => {
    mail.sendConfirm(req.body.id);
    res.sendStatus(200)
  },

  confirm: async (req, res, next) => {
    const filter = {
      _id: req.body.id
    };
    const data = {
      emailConfirmed: true,
      status: 'active'
    }
    let updateUser = await User.findOneAndUpdate(filter, data, {
      new: true
    });
    const token = signToken(updateUser);
    res.status(200).json({
      token
    });
  },

  checkJoinToken: async (req, res, next) => {
    //Check for token and user
    let token = req.body.token
    let filter = {
      _id: token
    };
    let findUser = await User.findOne(filter)
    if (findUser) {
      //User found -> Token Valid
      //check if User is invited
      if (findUser.status == "invitation") {
        res.status(200).json({
          msg: "",
          valid: true,
          findUser
        })
      } else {
        //No Date found
        res.status(200).json({
          msg: "token invalid",
          valid: false
        })
      }
    } else {
      //User not found -> Token Invalid
      res.status(200).json({
        msg: "token invalid",
        valid: false
      })
    }
  },

  join: async (req, res, next) => {
    const filter = {
      _id: req.body.id
    };
    const {
      name,
      email,
      password
    } = req.body;

    //bcrypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const data = {
      name,
      local: {
        email,
        password: passwordHash
      },
      emailConfirmed: true,
      status: 'active',
      registered: new Date()
    }

    // update User
    let updateUser = await User.findOneAndUpdate(filter, data, {
      new: true
    });
    const token = signToken(updateUser);
    res.status(200).json({
      token
    });
  },

  login: async (req, res, next) => {
    // Generate a token and respond with it
    const token = signToken(req.user);
    res.status(200).json({
      token
    });
  },

  secret: async (req, res, next) => {
    res.json({
      secret: req.user
    });
  },

  forgot: async (req, res, next) => {
    let filter = {
      "local.email": req.body.email
    };
    let findUser = await User.findOne(filter);
    if (findUser) {
      let token = findUser._id.toString();
      const tokenHash = JWS.encode(token, JWS_SECRET);
      findUser.resetPW = {
        token: tokenHash,
        date: new Date()
      }
      findUser.save();
      mail.sendReset(findUser.local.email, tokenHash);
    }
    res.sendStatus(200)
  },

  checkResetToken: async (req, res, next) => {
    //Check for token and user
    let Hashtoken = req.body.token
    let token = JWS.decode(Hashtoken, JWS_SECRET)
    let filter = {
      _id: token
    };
    let findUser = await User.findOne(filter)
    if (findUser) {
      //User found -> Token Vali
      //check if Date ist valid
      if (findUser.resetPW.date) {
        let validDate = new Date(new Date(findUser.resetPW.date).getTime() + 60 * 60 * 24 * 1000); //24h later
        const now = new Date();
        if (validDate > now) {
          //Token and Date Valid
          res.status(200).json({
            msg: "",
            valid: true
          })
        } else {
          //Date Expired
          res.status(200).json({
            msg: "token expired",
            valid: false
          })
        }
      } else {
        //No Date found
        res.status(200).json({
          msg: "token invalid",
          valid: false
        })
      }
    } else {
      //User not found -> Token Invalid
      res.status(200).json({
        msg: "token invalid",
        valid: false
      })
    }
  },

  reset: async (req, res, next) => {
    //Check for token and user
    let token = '';
    let Hashtoken = req.body.token;
    let password = req.body.password;
    token = JWS.decode(Hashtoken, JWS_SECRET)
    let filter = {
      _id: token
    };
    let findUser = await User.findOne(filter)
    if (findUser) {
      //Token Valid
      //check if Date ist valid
      if (findUser.resetPW.date) {
        let validDate = new Date(new Date(findUser.resetPW.date).getTime() + 60 * 60 * 24 * 1000); //24h later
        const now = new Date();
        if (validDate > now) {
          //Date Valid
          //bcrypt password
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);
          findUser.local.password = passwordHash
          //reset Token
          findUser.resetPW = {
            token: undefined,
            date: undefined
          }
          findUser.dates.lastPasswordReset = new Date();
          //save User
          findUser.save();
          res.status(200).json({
            msg: "success"
          })
        } else {
          //Date Invalid
          res.status(200).json({
            msg: "token invalid"
          })
        }
      }
    } else {
      //Token Invalid
      res.status(200).json({
        msg: "token invalid"
      })
    }

  },

  edit: async (req, res, next) => {
    const filter = {
      _id: req.body.id
    };
    const data = req.body.user;
    data.dates.lastEdited = new Date();
    let updateUser = await User.findOneAndUpdate(filter, data, {
      new: true
    });
    res.status(200).json({
      updateUser
    });
  },

  invite: async (req, res, next) => {
    const {
      email,
      name
    } = req.body;
    // Check if there is a user with the entered email
    const foundUser = await User.findOne({
      "local.email": email
    });
    if (foundUser) {
      return res.status(403).json({
        msg: 'Email is already in use'
      });
    }

    // Create a new user
    const newUser = new User({
      name,
      method: 'local',
      local: {
        email: email,
      },
      emailConfirmed: false,
      status: "invitation"
    });

    await newUser.save();
    // Send InvitationMail
    mail.sendInvitation(newUser._id, email);
    //Respond to Frontend
    res.status(200).json({
      newUser
    });
  },

  get: async (req, res, next) => {
    User.find({
      'deleted': false
    }, function (err, users) {
      if (err) return console.error(err);
      res.status(200).json({
        users
      });
    })
  },

  findSingle: async (req, res, next) => {
    const id = req.body.id;
    User.findById(id, function (err, user) {
      if (err) return console.error(err);
      res.status(200).json({
        user
      })
    });
  },

  delete: async (req, res, next) => {
    const filter = {
      _id: req.body.id
    };
    let findUser = await User.findOne(filter);
    if (findUser) {
      findUser.deleted = true;
      findUser.dates.deletedOn = new Date();
      findUser.save();
      res.sendStatus(200);
    } else {
      res.status(500).json({
        msg: "User ID not found"
      })
    }
  },

  deleteFinal: async (req, res, next) => {
    const id = req.body.id;
    User.deleteOne({
      _id: id
    }, function (error) {
      if (error) {
        res.send(err);
        console.log(err)
      } else {
        res.status(200).json({});
      }
    })
  },
}