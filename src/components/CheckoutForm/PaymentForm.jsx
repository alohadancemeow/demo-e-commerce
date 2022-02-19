import React, { useState, useEffect } from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review'
import axios from 'axios';

const PaymentForm = ({ checkoutToken, shippingData, backStep, onCaptureCheckout, nextStep, timeout }) => {
  // console.log(shippingData);
  // console.log(checkoutToken);

  // states
  const [clientSecret, setClienSecret] = useState('')
  // console.log(clientSecret);

  // stripe hooks
  const stripe = useStripe()
  const elements = useElements()

  // fetch payment intent
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const { data } = await axios.post('http://localhost:4000/create-payment-intent', {
        items: [{
          name: 'test'
        }],
        // receiptEmail: 'rabbit.bot@outlook.com'
      })
      // console.log(data);

      setClienSecret(data.clientSecret)
    }
    fetchPaymentIntent()

  }, [])

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    // create billing details
    const billingDetails = {
      name: shippingData.firstname + shippingData.lastname,
      email: shippingData.email,
      address: {
        city: shippingData.city,
        country: shippingData.shippingCountry,
        line1: shippingData.address1,
        state: shippingData.shippingSubdivision,
        postal_code: shippingData.zip
      }
    };


    try {

      // create payment method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: billingDetails
      })

      console.log(paymentMethod);
      console.log(error);



      // const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: elements.getElement(CardElement),
      //     billing_details: billingDetails
      //   }
      // })



      // create orderData for capture
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
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry
        },
        fulfillment: {
          shipping_method: shippingData.shippingOption
        },
        payment: {
          gateway: 'test_gateway',
          // stripe: {
          //   payment_method_id: paymentMethod.id,
          // },
          card: {
            number: '4242 4242 4242 4242',
            expiry_month: '01',
            expiry_year: '2023',
            cvc: '123',
            postal_zip_code: '94103',
          },
        }
      }

      // confirm payment
      if (!error) {
        const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id
        })
        console.log(paymentIntent);
      } else {
        console.log(error);
      }


      // call onCaptureCheckout, --> next
      onCaptureCheckout(checkoutToken.id, orderData)
      timeout() //waiting... 3sec
      nextStep()


    } catch (error) {
      console.log(error);
    }

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
    // const orderData = {
    //   line_items: checkoutToken.live.line_items,
    //   customer: {
    //     firstname: shippingData.firstname,
    //     lastname: shippingData.lastname,
    //     email: shippingData.email
    //   },
    //   shipping: {
    //     name: 'Primary',
    //     street: shippingData.address1,
    //     town_city: shippingData.city,
    //     country_state: shippingData.shippingSubdivision,
    //     postal_zip_code: shippingData.zip,
    //     country: shippingData.shippingCountry
    //   },
    //   fulfillment: {
    //     shipping_method: shippingData.shippingOption
    //   },
    //   payment: {
    //     gateway: 'test_gateway',
    //     card: {
    //       number: '4242 4242 4242 4242',
    //       expiry_month: '01',
    //       expiry_year: '2023',
    //       cvc: '123',
    //       postal_zip_code: '94103',
    //     },
    //   }
    // }

    // // call onCaptureCheckout, --> next
    // onCaptureCheckout(checkoutToken.id, orderData)
    // timeout() //waiting... 3sec
    // nextStep()

  }


  // set stripe options
  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };


  return (
    <>
      {clientSecret && (

        // <Elements options={options} stripe={stripePromise}>
        <>
          <Review checkoutToken={checkoutToken} />
          <Divider />
          <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>Payment methods</Typography>


          <form onSubmit={(e) => handleSubmit(e)}>
            <CardElement options={options} />
            <br /><br />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant='outlined' onClick={backStep}>Back</Button>
              <Button
                type='submit'
                variant='contained'
                // disabled={!stripe}
                color='primary'
              >
                Pay {checkoutToken.live.subtotal.formatted_with_symbol}
              </Button>
            </div>

          </form>
        </>
        // </Elements>
      )}
    </>
  )

}

export default PaymentForm;
