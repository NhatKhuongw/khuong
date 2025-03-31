var express = require('express');
var router = express.Router();
let userControllers = require('../controllers/users');
let { check_authentication } = require("../utils/check_auth");
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');

router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let result = await userControllers.checkLogin(username, password);
        
        if (!result) {
            return res.status(401).send({
                success: false,
                message: "Sai tài khoản hoặc mật khẩu"
            });
        }

        let token = jwt.sign(
            { id: result, expireIn: Date.now() + 3600 * 1000 },
            constants.SECRET_KEY
        );

        res.status(200).send({ success: true, data: token });
    } catch (error) {
        next(error);
    }
});

router.post('/signup', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let result = await userControllers.createAnUser(username, password, email, 'user');
        
        res.status(201).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

router.get('/me', check_authentication, async function (req, res, next) {
    try {
        res.status(200).send({ success: true, data: req.user });
    } catch (error) {
        next(error);
    }
});

router.post('/changepassword', check_authentication, async function (req, res, next) {
    try {
        let { oldpassword, newpassword } = req.body;
        let user = await userControllers.changePassword(req.user, oldpassword, newpassword);

        res.status(200).send({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
