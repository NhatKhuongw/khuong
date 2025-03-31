const express = require('express');
const router = express.Router();
const productSchema = require('../schemas/product');
const categorySchema = require('../schemas/category');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', async (req, res) => {
  try {
    let products = await productSchema.find().populate({ path: 'category', select: 'name' });
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post('/', authenticate, authorizeRole('mod'), async (req, res) => {
  try {
    let body = req.body;
    let category = await categorySchema.findOne({ name: body.category });

    if (!category) {
      return res.status(404).send({ success: false, message: 'Category không tồn tại' });
    }

    let newProduct = new productSchema({
      name: body.name,
      price: body.price || 0,
      quantity: body.quantity || 0,
      category: category._id,
    });

    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.put('/:id', authenticate, authorizeRole('mod'), async (req, res) => {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.delete('/:id', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    product.isDeleted = true;
    await product.save();

    res.status(200).send({ success: true, message: 'Sản phẩm đã bị xóa' });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
