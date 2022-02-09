import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Cart, Navbar, Products, Checkout } from './components'

const App = () => {

    // # States
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')


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

    // Refresh the cart and update the cart state
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh()
        setCart(newCart)
    }


    /**
     * It captures the checkout.
     * @param checkoutTokenId - The checkout token ID returned from the createCheckoutToken call.
     * @param newOrder - The order object that will be sent to the merchant.
     */
    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        console.log(`checkoutTokenId --> ${checkoutTokenId}`);
        console.log(`newOrder --> ${newOrder}`);
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
            console.log(incomingOrder)

            setOrder(incomingOrder)
            refreshCart()
        } catch (error) {
            console.log(error);
            setErrorMessage(error.data.error.message)
        }
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
                    <Route path='/' element={
                        <Products
                            products={products}
                            onAddToCart={handleAddToCart}
                        />
                    } />
                    <Route path='/cart' element={
                        <Cart
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}
                        />
                    } />
                    <Route path='/checkout' element={
                        <Checkout
                            cart={cart}
                            order={order}
                            onCaptureCheckout={handleCaptureCheckout}
                            error={errorMessage}
                        />
                    } />
                </Routes>

            </div>
        </BrowserRouter>
    )
};

export default App;
