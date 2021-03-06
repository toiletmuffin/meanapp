const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const userController = require('../controllers/userController');

// Register
router.post('/register', (req, res, next) => {
	userController.addUser(req, (err, user) => {
		if(err) {
			res.json({success: false, msg: 'Failed to register user'});
		} else {
			res.json({success: true, msg: 'User registered'});
		}
	});
});

// Authenticate
router.post('/auth', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	if(username && password) {
		userController.getUserByUsername(username, (err, user) => {
			if(err) {
				throw err;
			}

			if(!user) {
				return res.json({success: false, msg: 'User not found'});
			}

			userController.comparePassword(password, user.password, (err, isMatch) => {
				if(err) {
					throw err;
				}

				if(isMatch) {
					const token = jwt.sign(user, config.secret, {
						expiresIn: 604800 // 1 week
					});

					res.json({
						success: true,
						token: 'JWT ' + token,
						user: {
							id: user._id,
							name: user.name,
							username: user.username,
							email: user.email,
							lastLogin: user.lastLogin
						}
					});

					userController.updateLogin(user._id, (err, result) => {
						if(err) {
							throw err;
						}
					});

				} else {
					return res.json({success: false, msg: 'Wrong password'});
				}
			});
		});
	} else {
		return res.json({success: false, msg: 'No username or password'});
	}
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json({user: req.user});
});

module.exports = router;
