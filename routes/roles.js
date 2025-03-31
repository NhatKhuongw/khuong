var express = require('express');
var router = express.Router();
const roleSchema = require('../schemas/role');
const { check_authentication, check_authorization } = require("../utils/check_auth");

router.get('/', async function (req, res, next) {
  try {
    let roles = await roleSchema.find({});
    res.status(200).send({ success: true, data: roles });
  } catch (error) {
    res.status(500).send({ success: false, message: "Lỗi khi lấy danh sách roles" });
  }
});

router.post('/', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let body = req.body;
    if (!body.name) {
      return res.status(400).send({ success: false, message: "Tên role không được để trống" });
    }

    let newRole = new roleSchema({ name: body.name });
    await newRole.save();
    res.status(201).send({ success: true, data: newRole });
  } catch (error) {
    res.status(500).send({ success: false, message: "Lỗi khi tạo role" });
  }
});

module.exports = router;
