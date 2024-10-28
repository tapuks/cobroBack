import fs from 'fs';
import { randomUUID } from 'node:crypto';

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

export class ProductModel {
  static async getAllProducts(category) {
    if (category) {
      const filteredProducts = products.filter(
        (product) =>
          product.category.toLocaleLowerCase() === category.toLocaleLowerCase()
      );
      return filteredProducts;
    }
    return products;
  }

  static async getProductById(id) {
    const productId = products.find((product) => product.id === id);
    return productId;
  }

  static async createProduct(product) {
    const newProduct = {
      id: randomUUID(),
      ...product,
    };
    products.push(newProduct);
    return newProduct;
  }

  static async updateProduct(id, validate) {
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    const updateProduct = { ...products[productIndex], ...validate.data };
    products[productIndex] = updateProduct;
    return products[productIndex];
  }

  static async deleteProduct(id) {
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return false;
    }
    products.splice(productIndex, 1);
    return true;
  }
}
