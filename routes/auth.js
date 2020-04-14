const router = require('express-promise-router')();
const passport = require('passport');
require('../config/passport');
const {
  validateBody,
  schemas
} = require('../helpers/routeHelpers');
const authController = require('../controllers/auth');
const passportSignIn = passport.authenticate('local', {
  session: false
});
const passportJWT = passport.authenticate('jwt', {
  session: false
});

// Register new User
router.post('/register', validateBody(schemas.registerSchema), authController.register)

// Resend confirmation email
router.post('/resend', authController.resend);

// Confirm email address
router.post('/confirm', authController.confirm);

// Signin with email and password
router.post('/login',
  validateBody(schemas.loginSchema),
  passportSignIn,
  authController.login
);

// Authentication
router.get('/secret', passportJWT, authController.secret);

// Forgot password
router.post('/forgot', authController.forgot);

// Check Token to reset password
router.post('/checkresettoken', authController.checkResetToken);

// Reset password
router.post('/reset', authController.reset);

// Edit Single User, self or as admin
router.post('/edit', authController.edit);

// Admin: Invite new User to join
router.post('/invite', authController.invite);

// Check Token to join
router.post('/checkJoinToken', authController.checkJoinToken);

// New user: Join
router.post('/join', authController.join);

// get all users
router.get('/get', authController.get)

// find single user or users by id
router.post('/findsingle', authController.findSingle)

// delete user by id - set deleted true in database
router.post('/delete', authController.delete)

// delete user by id finally - delete from database
router.post('/deletefinal', authController.deleteFinal)

module.exports = router;