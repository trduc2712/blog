const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    if (categories.length === 0) {
        return res.status(404).json({ error: 'Không có danh mục nào' });
    }
    res.json({
        message: 'Lấy tất cả danh mục thành công',
        categories: categories
    });
  } catch (err) {
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};
