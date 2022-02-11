import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review'

// load stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const PaymentForm = ({ checkoutToken, shippingData, backStep, onCaptureCheckout, nextStep, timeout }) => {
  console.log(shippingData);
  console.log(checkoutToken);

  // Handle submit
  const handleSubmit = async (e, elements, stripe) => {
    e.preventDefault()

    // if (!stripe || !elements) return

    // const cardElement = elements.getElement(CardElement)
    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement
    // })

    // if (error) {
    //   console.log(error);
    // } else {

    //   // create orderData
    //   const orderData = {
    //     line_items: checkoutToken.live.line_items,
    //     customer: {
    //       firstname: shippingData.firstname,
    //       lastname: shippingData.lastname,
    //       email: shippingData.email
    //     },
    //     shipping: {
    //       name: 'Primary',
    //       street: shippingData.address1,
    //       town_city: shippingData.city,
    //       country_state: shippingData.shippingSubdivision,
    //       postal_zip_code: shippingData.zip,
    //       conutry: shippingData.shippingCountry
    //     },
    //     fulfillment: {
    //       shipping_method: shippingData.shippingOption
    //     },
    //     payment: {
    //       gateway: 'stripe',
    //       stripe: {
    //         payment_method_id: paymentMethod.id
    //       }
    //     }
    //   }


    // Test payment gateway
    const orderData = {
      line_items: checkoutToken.live.line_items,
      customer: {
        firstname: shippingData.firstname,
        lastname: shippingData.lastname,
        email: shippingData.email
      },
      shipping: {
        name: 'Primary',
        street: shippingData.address1,
        town_city: shippingData.city,
        country_state: shippingData.shippingSubdivision,
        postal_zip_code: shippingData.zip,
        country: shippingData.shippingCountry
      },
      fulfillment: {
        shipping_method: shippingData.shippingOption
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: '4242 4242 4242 4242',
          expiry_month: '01',
          expiry_year: '2023',
          cvc: '123',
          postal_zip_code: '94103',
        },
      }
    }

    // call onCaptureCheckout, --> next
    onCaptureCheckout(checkoutToken.id, orderData)
    timeout() //waiting... 3sec
    nextStep()

  }


  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>Payment methods</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br /><br />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>

            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}

export default PaymentForm;
