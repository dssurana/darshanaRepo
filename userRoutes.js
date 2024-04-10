/* Required External Modules and Interfaces */

/* Router Definition */
let userController = require('./userController')
const userRouter = require('express').Router();

userRouter.get('/register', userController.register);

userRouter.get('/login',  userController.login);

module.exports = userRouter;
