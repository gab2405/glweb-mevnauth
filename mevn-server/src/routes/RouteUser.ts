const router = require('express-promise-router')();
const userController = require('../controllers/userController');
import { initPassport, passportLogin, passportJWT } from '../config/passport';
const {
  validateBody,
  schemas,
} = require('../helpers/routeHelpers');

/**
 * init passport authentication strategies
 */
initPassport()

/**
 * Register a new user
 */
router.post('/register', validateBody(schemas.registerSchema), userController.register);

/**
 * Login
 */
router.post('/login', validateBody(schemas.loginSchema), passportLogin, userController.login);

/**
 * Authenticate
 */
router.get('/secret', passportJWT, userController.secret);

module.exports = router;