const express = require('express');
const form_controller = require('./controllers/form_controller');
const userController = require('./controllers/user_controller');
const router = express.Router();


router.post('/account/create', userController.createAccount);

router.post('/account/login', userController.login);

router.post('/form/new', form_controller.createForm);

// router.post('/account/post/create', post_controller.createPost);

// router.post('/account/post/react', post_controller.react);

// router.post('/account/post/unreact', post_controller.unReact);

// router.post('/account/post/comment', post_controller.comment);

router.post('/account/logout', userController.logout);

// router.post('/send/request', friendship_transaction_controller.sendFriendRequest);

// router.post('/request/accept', friendship_transaction_controller.acceptFriendRequest);

// router.get('/get/allRequest',friendship_transaction_controller.allFriendRequest);

// router.get('/get/allRequest/:userToken',friendship_transaction_controller.specificFriendRequest);


module.exports = router;