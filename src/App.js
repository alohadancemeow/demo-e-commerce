import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Navbar, Products } from './components'

const App = () => {

    // # State
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})


    // It fetches the products from the Commerce API.
    const fetchProducts = async () => {
        const { data } = await commerce.products.list()
        setProducts(data)
    }

    // It retrieves the cart from the Commerce API.
    const fetchCart = async () => {
        const cart = await commerce.cart.retrieve()
        setCart(cart)
    }
    
    /**
     * It adds the product to the cart.
     * @param productId - The product ID of the item you want to add to the cart.
     * @param quantity - The number of items to add to the cart.
     */
    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity)
        // console.log(item);
        setCart(item.cart)
    }

    // EFFECT: 
    useEffect(() => {
        fetchProducts()
        fetchCart()
    }, [])

    // console.log(products);
    console.log(cart)

    return (
        <div>
            <Navbar totalItems={cart.total_items} />
            <Products products={products} onAddToCart={handleAddToCart} />
        </div>
    )
};

export default App;
