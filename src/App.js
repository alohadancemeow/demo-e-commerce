import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Cart, Navbar, Products } from './components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
        const { cart } = await commerce.cart.add(productId, quantity)
        setCart(cart)
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity })
        setCart(cart)
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId)
        setCart(cart)
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty()
        setCart(cart)
    }


    // EFFECT: 
    useEffect(() => {
        fetchProducts()
        fetchCart()
    }, [])

    // console.log(products);
    // console.log(cart)

    return (
        <BrowserRouter>
            <div>
                <Navbar totalItems={cart.total_items} />

                <Routes>
                    <Route path='/' element={<Products products={products} onAddToCart={handleAddToCart} />} />
                    <Route path='/cart' element={
                        <Cart
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}
                        />
                    } />
                </Routes>

            </div>
        </BrowserRouter>
    )
};

export default App;
