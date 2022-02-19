import React from 'react'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)


const Layout = ({ children}) => {
    return (
        <>
            <Elements stripe={stripePromise}>{children}</Elements>
        </>
    )
}

export default Layout