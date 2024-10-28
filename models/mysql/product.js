import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'productsdb',
};

const connection = await mysql.createConnection(config);

export class ProductModel {
  static async getAllProducts(category) {
    console.log(category);

    if (category) {
      const [categorye] = await connection.query(
        'SELECT * FROM category WHERE name = ?',
        [category.toLowerCase()]
      );
      if (categorye.length === 0) {
        return [];
      } else if (categorye.length > 0) {
        const [products] = await connection.query(
          `SELECT p.nombre, p.precio, p.seleccionado, p.cantidad, BIN_TO_UUID(p.id) id
       FROM product p
       JOIN product_category pc ON p.id = pc.product_id
       JOIN category c ON pc.category_id = c.id
       WHERE c.id = ?`,
          [categorye[0].id]
        );
        console.log('11', products);
        return products;
      }
    }

    //  [product] is the same as product[0]
    const [product] = await connection.query(
      'SELECT nombre, precio, seleccionado, cantidad, BIN_TO_UUID(id) id FROM product'
    );
    console.log('22', product);
    return product;
  }

  static async getProductById(id) {
    const [product] = await connection.query(
      'SELECT nombre, precio, seleccionado, cantidad, BIN_TO_UUID(id) id FROM product WHERE id = UUID_TO_BIN(?)',
      [id]
    );

    console.log('33', product);

    if (product.length === 0) {
      return null;
    }
    return product[0];
  }

  static async createProduct(product) {
    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const uuid = uuidResult[0].uuid;

    console.log('44', uuid);

    try {
      await connection.query(
        'INSERT INTO product (id, nombre, precio, seleccionado, cantidad) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)',
        [
          [uuid],
          product.nombre,
          product.precio,
          product.seleccionado,
          product.cantidad,
        ]
      );
    } catch (error) {
      throw new Error('Error creating product');
    }

    const productCreate = await connection.query(
      'SELECT nombre, precio, seleccionado, cantidad, BIN_TO_UUID(id) id FROM product WHERE id = UUID_TO_BIN(?)',
      [uuid]
    );

    return productCreate[0];
  }

  static async updateProduct(id, validate) {
    try {
      const [product] = await connection.query(
        'SELECT nombre, precio, seleccionado, cantidad, BIN_TO_UUID(id) id FROM product WHERE id = UUID_TO_BIN(?)',
        [id]
      );

      console.log('55', product[0]);
      console.log('validate', validate);

      if (product.length === 0) {
        return null;
      }

      const productUpdate = {
        ...product[0],
        ...validate.data,
      };

      await connection.query(
        'UPDATE product SET nombre = ?, precio = ?, seleccionado = ?, cantidad = ? WHERE id = UUID_TO_BIN(?)',
        [
          productUpdate.nombre,
          productUpdate.precio,
          productUpdate.seleccionado,
          productUpdate.cantidad,
          id,
        ]
      );

      return productUpdate;
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteProduct(id) {
    try {
      const [product] = await connection.query(
        'SELECT nombre, precio, seleccionado, cantidad, BIN_TO_UUID(id) id FROM product WHERE id = UUID_TO_BIN(?)',
        [id]
      );

      console.log('66', product);

      if (product.length === 0) {
        return null;
      }

      await connection.query('DELETE FROM product WHERE id = UUID_TO_BIN(?)', [
        id,
      ]);

      return product;
    } catch (error) {
      console.log(error);
    }
  }
}
