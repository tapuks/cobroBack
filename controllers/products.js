// import { ProductModel } from '../models/local/products.js';
import { ProductModel } from '../models/mysql/product.js';
import {
  validateProduct,
  validatePartialProduct,
} from '../schemas/products.js';
import fs from 'fs';

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

export class ProductController {
  static async getAllProducts(req, res) {
    const { category } = req.query;
    console.log('categoria', category);
    const products = await ProductModel.getAllProducts(category);
    res.json(products);
  }

  static async getProductById(req, res) {
    const { id } = req.params;

    try {
      const productId = await ProductModel.getProductById(id);
      if (productId) {
        return res.json(productId);
      }
      res.status(404).json({ error: 'Product not found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createProduct(req, res) {
    const validate = validateProduct(req.body);
    if (!validate.success) {
      return res.status(400).json({ error: validate.error });
    }

    const newProduct = await ProductModel.createProduct(validate.data);

    res.status(201).json(newProduct);
  }

  static async updateProduct(req, res) {
    const validate = validatePartialProduct(req.body);
    if (!validate.success) {
      return res.status(400).json({ error: validate.error });
    }

    const { id } = req.params;
    const updateProduct = await ProductModel.updateProduct(id, validate);
    if (!updateProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(updateProduct);
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    const productDeleted = await ProductModel.deleteProduct(id);
    if (!productDeleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  }
}
