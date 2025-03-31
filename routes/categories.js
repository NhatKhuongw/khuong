const express = require('express');
const router = express.Router();
const categorySchema = require('../schemas/category');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  try {
    let categories = await categorySchema.find({});
    res.status(200).send({ success: true, data: categories });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: 'Category không tồn tại' });
    }
    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.post('/', authenticate, authorizeRole('mod'), async (req, res) => {
  try {
    let newCategory = new categorySchema({ name: req.body.name });
    await newCategory.save();
    res.status(201).send({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.put('/:id', authenticate, authorizeRole('mod'), async (req, res) => {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: 'Category không tồn tại' });
    }

    category.name = req.body.name || category.name;
    await category.save();

    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.delete('/:id', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: 'Category không tồn tại' });
    }

    category.isDeleted = true;
    await category.save();

    res.status(200).send({ success: true, message: 'Category đã bị xóa' });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
