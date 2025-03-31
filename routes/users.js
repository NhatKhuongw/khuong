var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/users');
const { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

router.get('/', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    let users = await userControllers.getAllUsers();
    res.status(200).send({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    let requestedId = req.params.id;
    let currentUserId = req.user.id;

    if (requestedId === currentUserId) {
      return res.status(403).send({ success: false, message: "Bạn không được xem thông tin của chính mình" });
    }

    let user = await userControllers.getUserById(requestedId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User không tồn tại" });
    }

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userControllers.createAnUser(body.username, body.password, body.email, body.role);
    res.status(201).send({ success: true, data: newUser });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.put('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let updatedUser = await userControllers.updateAnUser(req.params.id, req.body);
    res.status(200).send({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let deleteUser = await userControllers.deleteAnUser(req.params.id);
    res.status(200).send({ success: true, message: deleteUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
