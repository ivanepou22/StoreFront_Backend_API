import { Request, Response } from 'express';
import { Product, ProductUpdate, ProductStore } from '../models/product.model';

const store = new ProductStore();

//Show all the products
export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//show product by id
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await store.show(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//delete a product
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedProduct = await store.delete(req.params.id);
    res.json(deletedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//create a Product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//edit/update Product
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product: ProductUpdate = {};
    if (req.body.name) {
      product.name = req.body.name;
    }
    if (req.body.price) {
      product.price = req.body.price;
    }

    const updatedProduct = await store.update(req.params.id, product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
