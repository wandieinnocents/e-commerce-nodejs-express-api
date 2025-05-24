const Product = require("../../models/Product");
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
const productValidationSchema = require('../../validations/Product/ProductValidation');
const mongoose = require('mongoose');

// store product
const createProduct = async (req, res) => {

  try {
    const validatedData = await productValidationSchema.validateAsync(req.body);

    const {
      name, supplier_id, brand_id, branch_id, parent_product_category_id,
      product_category_id, unit_id, expiry_date, stock_quantity, cost_price,
      selling_price, status, description, stock_alert, featured_image, image_gallery, created_by, updated_by
    } = validatedData;

    const existing = await Product.findOne({ name });
    if (existing) return res.status(401).json({ message: "Product with this name already exists" });

    // Generate new product  code
    const lastProduct = await Product.findOne().sort({ createdAt: -1 });
    let newId = 1;

    if (lastProduct && lastProduct.code) {
      const lastCode = lastProduct.code;
      const match = lastCode.match(/PRD-(\d+)/);
      if (match && match[1]) {
        newId = parseInt(match[1]) + 1;
      }
    }

    // Format to 5 digits
    const formattedId = String(newId).padStart(5, '0');
    const code = `PRD-${formattedId}`;

    // Get logged-in user
    if (!req.user || !req.user._id) {
      return unauthorizedResponse(res, { message: "User not authenticated" });
    }
    const logged_in_user = req.user._id;
    const newProduct = await Product.create({
      code, name, supplier_id, brand_id, branch_id, parent_product_category_id,
      product_category_id, unit_id, expiry_date, stock_quantity, cost_price,
      selling_price, status, description, stock_alert, featured_image, image_gallery,
      created_by: logged_in_user, updated_by
    });

    //respose
    return createdResponse(res, {
      message: "Product created successfully",
      data: newProduct
    });

  } catch (error) {
    console.log(error);
    // Handle validation errors
    if (error.isJoi) {
      return badRequestResponse(res, {
        message: error.details[0].message
      });
    }

    // Handle other errors
    return serverErrorResponse(res, {
      message: error.message
    });
  }
};

// get all products
const getAllProducts = async (req, res) => {

  try {

    const products = await Product.find()
      .populate('created_by', 'username email')   // populate created_by user fields
      .populate('updated_by', 'username email') // populate updated_by user fields
      .populate('parent_product_category_id', 'parent_product_category_name')
      .populate('product_category_id', 'product_category_name')
      .populate('supplier_id', 'supplier_name')
      .populate('brand_id', 'brand_name')
      .populate('branch_id', 'branch_name')
      .populate('unit_id', 'name');

    const products_count = await Product.countDocuments();

    //if no products found
    if (!products || products.length === 0) {
      return notFoundResponse(res, {
        message: "No product categories found",
      });
    }

    return successResponse(res, {
      message: "Product categories retrieved successfully",
      records_count: products_count,
      data: products
    });

  } catch (error) {
    // Handle validation errors
    if (error.isJoi) {
      return badRequestResponse(res, {
        message: error.details[0].message
      });
    }

    // Handle other errors
    return serverErrorResponse(res, {
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate('created_by', 'username email')   // populate created_by user fields
      .populate('updated_by', 'username email') // populate updated_by user fields
      .populate('parent_product_category_id', 'parent_product_category_name')
      .populate('product_category_id', 'product_category_name')
      .populate('supplier_id', 'supplier_name')
      .populate('brand_id', 'brand_name')
      .populate('branch_id', 'branch_name')
      .populate('unit_id', 'name');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });

    }
    // res.status(200).json(product);
    return successResponse(res, {
      message: "Product retrieved successfully",
      data: product
    });


  } catch (error) {
    // Handle validation errors
    if (error.isJoi) {
      return badRequestResponse(res, {
        message: error.details[0].message
      });
    }

    // Handle other errors
    return serverErrorResponse(res, {
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;


  try {

    const validatedData = await productValidationSchema.validateAsync(req.body);
    const {
      name, supplier_id, brand_id, branch_id, parent_product_category_id,
      product_category_id, unit_id, expiry_date, stock_quantity, cost_price,
      selling_price, status, description, stock_alert, featured_image, image_gallery, created_by, updated_by
    } = validatedData;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, {
        message: "Invalid product  ID format",
      });
    }



    const existing = await Product.findOne({
      // Exclude the current product  from the search
      _id: { $ne: id },
      $or: [
        { name },
      ]
    });

    if (existing) {
      if (existing.name === name) {
        return unauthorizedResponse(res, {
          message: "Product  with this name  already exists"
        });
      }
    }

    // Get logged-in user
    const logged_in_user = req.user._id;

    const updated = await Product.findByIdAndUpdate(id, {
      name, supplier_id, brand_id, branch_id, parent_product_category_id,
      product_category_id, unit_id, expiry_date, stock_quantity, cost_price,
      selling_price, status, description, stock_alert, featured_image, image_gallery, created_by, updated_by: logged_in_user

    }, { new: true });

    if (!updated) {
      return notFoundResponse(res, {
        message: "Product not found",
      });
    }



    // res.status(200).json(updated);
    return successResponse(res, {
      message: "Product updated successfully",
      data: updated
    });

  } catch (error) {
    // joi validation errors 
    if (error.isJoi) {
      return badRequestResponse(res, {
        message: error.details[0].message
      });
    }

    //handle other errors
    return serverErrorResponse(res, {
      error: error.message
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestResponse(res, {
      message: "Invalid product  ID format",
    });
  }

  try {
    const product = await Product.findByIdAndDelete(id)
      .populate('created_by', 'username email')   // populate created_by user fields
      .populate('updated_by', 'username email') // populate updated_by user fields
      .populate('parent_product_category_id', 'parent_product_category_name')
      .populate('product_category_id', 'product_category_name')
      .populate('supplier_id', 'supplier_name')
      .populate('brand_id', 'brand_name')
      .populate('branch_id', 'branch_name')
      .populate('unit_id', 'name');
    if (!product) {
      return notFoundResponse(res, {
        message: "Product not found",
      });
    }
    // response
    return successResponse(res, {
      message: "Product deleted successfully",
      data: product
    });


  } catch (error) {
    // joi validation errors 
    if (error.isJoi) {
      return badRequestResponse(res, {
        message: error.details[0].message
      });
    }

    //handle other errors
    return serverErrorResponse(res, {
      error: error.message
    });
  }
};

// const getByCategory = async (req, res) => {
//   const { category } = req.params;
//   try {
//     const products = await Product.find({ category });
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// get products by category_id
const getProductsByCategoryId = async (req, res) => {
  try {
    const {
      category
    } = req.params; // Assuming category_id is passed as a URL parameter

    const products = await Product.find({
      product_category_id: category
    })
      .populate('created_by', 'username email') // populate created_by user fields
      .populate('updated_by', 'username email') // populate updated_by user fields
      .populate('parent_product_category_id', 'parent_product_category_name')
      .populate('product_category_id', 'product_category_name')
      .populate('supplier_id', 'supplier_name')
      .populate('brand_id', 'brand_name')
      .populate('branch_id', 'branch_name')
      .populate('unit_id', 'name');

    const products_count = await Product.countDocuments({
      product_category_id: category
    });

    // If no products found for the given category
    if (!products || products.length === 0) {
      return notFoundResponse(res, {
        message: "No products found for this category.",
      });
    }

    return successResponse(res, {
      message: "Products retrieved successfully for the specified category",
      records_count: products_count,
      data: products
    });

  } catch (error) {
    // Handle validation errors
    if (error.isJoi) {
      return badRequestResponse(res, {
        message: error.details[0].message
      });
    }

    // Handle other errors
    return serverErrorResponse(res, {
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId
};
