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

exports.getCategoryCount = async (req, res) => {
  try {
      const count = await Category.getCategoryCount();
      if (count == 0) {
          return res.status(404).json({ error: 'Không có danh mục nào' });
      }
      res.json({
          message: 'Lấy số lượng danh mục thành công',
          count: count
      });
  } catch (err) {
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
}

exports.getCategoriesWithPagination = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
      const totalCategories = await Category.getCategoryCount();
      
      const categories = await Category.getCategoriesWithPagination(page, limit);

      if (categories.length === 0) {
          return res.status(404).json({ error: 'Không có danh mục nào' });
      }

      res.json({
          message: `Lấy các danh mục ở trang ${page} thành công`,
          categories: categories,
          totalCategories: totalCategories,
          currentPage: page,
          totalPages: Math.ceil(totalCategories / limit)
      });
  } catch (err) {
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

exports.deleteCategoryById = async (req, res) => {
  const categoryId = parseInt(req.params.id);
  if (!categoryId) {
      return res.status(400).json({ error: 'Thiếu ID của danh mục' });
  }
  try {
      await Category.deleteCategoryById(categoryId);
      return res.status(200).json({ message: 'Xóa danh mục thành công' });
  } catch (err) {
      return res.status(500).json({ error: 'Lỗi máy chủ' });
  }  
}