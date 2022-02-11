import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'

import { commerce } from '../../../lib/commerce';

import useStyles from './styles'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { Link, useNavigate } from 'react-router-dom';

// steps
const steps = ['Shipping address', 'Payment details']

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {

    const classes = useStyles()
    const navigate = useNavigate()

    // States
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const [isFinished, setIsfinished] = useState(false)

    // Handle next
    const nextStep = () => setActiveStep(prevActiveStep => prevActiveStep + 1)
    const backStep = () => setActiveStep(prevActiveStep => prevActiveStep - 1)
    const next = (data) => {
        console.log(data);
        setShippingData(data)
        nextStep()
    }

    // set timeout
    const timeout = () => {
        setTimeout(() => {
            console.log('wait a minute.');
            setIsfinished(true)
        }, 3000)
    }

    // Confirmation form
    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to home</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant='h5'>Thank you for your purchase</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div >
    )

    // Error form
    if (error) {
        <>
            <Typography variant='h5'>Error: {error}</Typography>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to home</Button>
        </>
    }

    // Forms
    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm checkoutToken={checkoutToken} shippingData={shippingData} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />


    // # Effect
    useEffect(() => {

        const generateToken = async () => {

            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
                console.log('token', token);
                setCheckoutToken(token)
            } catch (error) {
                console.log(error);
                navigate('/')
            }
        }
        if (cart.line_items.length !== 0) {
            generateToken()
        }

    }, [cart])


    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center' >Checkout </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map(step => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {activeStep === steps.length
                        ? <Confirmation />
                        : checkoutToken && <Form />
                    }

                </Paper>
            </main>
        </>
    )
};

export default Checkout;
