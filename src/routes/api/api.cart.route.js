import Product from "#root/models/product.model.js";
import {ErrorMessage} from "../../errors/message.js";
import express from "express";

const router = express.Router();
router.post('/add-cart', (req, res) => {
    const products = req.cookies?.cart || [];

    const {id, quantity} = req.body;

    const product = products.find(product => product.id === id);
    if (product) {
        product.quantity = quantity;
    } else {
        products.push({id, quantity});
    }

    res.cookie('cart', products, {maxAge: 1000 * 60 * 60 * 24 * 30});

    return res.json({products, status: 200});
})

router.get('/cart-products', async (req, res) => {
    const products = req.cookies?.cart || [];
    console.log("cookie.cart: ", products);

    if (products.length === 0) {
        return res.json({products: [], total: 0});
    }

    // const ids = products.map(product => product.id);
    // const quantities = products.map(product => product.quantity);
    let productInCart = [];
    let total = [];
    try {
        // const productsInCart = await Product.find({_id: {$in: ids}}).select(['name', 'retailPrice', 'image']);
        // return res.json({products: productsInCart, total: quantities});
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].id).select(['name', 'retailPrice', 'image']);
            productInCart.push(product);
            total.push(products[i].quantity);
        }
        return res.json({products: productInCart, total});

    } catch (e) {
        console.log(e);
        return res.status(500).json(ErrorMessage(500, 'Internal server error'));
    }
});

router.delete('/cart-item', (req, res) => {
    const products = req.cookies?.cart || [];

    const {id} = req.body;
    if (!id) {
        return res.status(400).json(ErrorMessage(400, 'Bad request'));
    }

    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        return res.status(404).json(ErrorMessage(404, 'Not found'));
    }

    products.splice(index, 1);

    res.cookie('cart', products, {maxAge: 1000 * 60 * 60 * 24 * 30});
    return res.status(200).json({products});
})

router.delete('/clear-cart', (req, res) => {
    res.clearCookie('cart');
    return res.status(200).json({products: []});
})

export default router;