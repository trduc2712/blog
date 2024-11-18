import {
  getAllCategories as getAllCategoriesFromModal,
  getCategoryCount as getCategoryCountFromModal,
  getCategoriesWithPagination as getCategoriesWithPaginationFromModal,
  deleteCategoryById as deleteCategoryByIdFromModal,
  getCategoryById as getCategoryByIdFromModal,
  updateCategory as updateCategoryFromModal,
  createCategory as createCategoryFromModal,
} from '../models/category.js';

export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit && (page <= 0 || limit <= 0)) {
      return res.status(400).json({ error: 'Tham số không hợp lệ.' });
    }

    const categoryCount = await getCategoryCountFromModal();
    const categories =
      page && limit
        ? await getCategoriesWithPaginationFromModal(page, limit)
        : await getAllCategoriesFromModal();

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Không có danh mục nào.' });
    }

    res.json({
      message:
        page && limit
          ? `Lấy các danh mục ở trang ${page} thành công.`
          : 'Lấy tất cả danh mục thành công.',
      categories,
      meta: {
        categoryCount,
        currentPage: page || undefined,
        totalPages:
          page && limit ? Math.ceil(categoryCount / limit) : undefined,
      },
    });
  } catch (err) {
    console.log('Lỗi khi lấy danh mục: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const createCategory = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    res.status(400).json({ error: 'Thiếu thông tin danh mục.' });
  }

  try {
    await createCategoryFromModal(name, slug);
    return res.status(201).json({ message: 'Tạo danh mục thành công' });
  } catch (err) {
    console.log('Lỗi khi tạo danh mục mới: ', err);
    return res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

export const getCategory = async (req, res) => {
  const id = req.params.id;

  if (!id || id <= 0) {
    return res.status(400).json({ error: 'Tham số không hợp lệ.' });
  }

  try {
    const category = await getCategoryByIdFromModal(id);

    if (!category) {
      return res.status(404).json({ error: 'Danh mục không tồn tại.' });
    }

    res.json({
      message: 'Lấy danh mục thành công.',
      category: category,
    });
  } catch (err) {
    console.log('Lỗi khi lấy danh mục: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;

  const { name, slug } = req.body;

  try {
    const result = await updateCategoryFromModal(id, name, slug);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
    }

    const updatedCategory = await getCategoryByIdFromModal(id);
    res.json({
      message: 'Cập nhật thông tin danh mục thành công.',
      category: updatedCategory,
    });
  } catch (err) {
    console.log('Lỗi khi cập nhật danh mục: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const deleteCategoryById = async (req, res) => {
  const categoryId = parseInt(req.params.id);

  if (!categoryId) {
    return res.status(400).json({ error: 'Thiếu ID của danh mục.' });
  }
  try {
    await deleteCategoryByIdFromModal(categoryId);
    return res.status(200).json({ message: 'Xóa danh mục thành công.' });
  } catch (err) {
    console.log('Lỗi khi xóa danh mục: ', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
