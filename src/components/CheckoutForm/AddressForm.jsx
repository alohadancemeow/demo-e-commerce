import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';

import FormInput from './CustomTextField'

const AddressForm = ({ checkoutToken, next }) => {

    // # States
    const [shippingCountries, setShippingCountries] = useState([])
    const [shippingCountry, setShippingCountry] = useState('')
    const [shippingSubdivisions, setShippingSubdivisions] = useState([])
    const [shippingSubdivision, setShippingSubdivision] = useState('')
    const [shippingOptions, setShippingOptions] = useState([])
    const [shippingOption, setShippingOption] = useState('')

    // # Hooks
    const methods = useForm()
    const { control, handleSubmit, formState: { errors } } = methods

    const onSubmit = data => {
        console.log(data);
        next({
            ...data,
            shippingCountry,
            shippingSubdivision,
            shippingOption
        })
    }


    // # Fetch
    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
        // console.log('countries', countries);

        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }

    const fetchSubdidvision = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
        // console.log('subdivisions', subdivisions);

        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })
        // console.log('options', options);

        setShippingOptions(options)
        setShippingOption(options[0].id)
    }

    // get key,name from countries  --> 'TH' : 'Thailand'
    const countries = Object.entries(shippingCountries)
        .map(([code, name]) => ({ id: code, label: name }))
    // console.log(countries);

    const subdivisions = Object.entries(shippingSubdivisions)
        .map(([code, name]) => ({ id: code, label: name }))
    // console.log(subdivisions);

    const options = shippingOptions.map(so => ({
        id: so.id,
        label: `${so.description} - (${so.price.formatted_with_symbol})`
    }))
    // console.log(options)


    // # Effect
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    }, [])

    useEffect(() => {
        if (shippingCountry) fetchSubdidvision(shippingCountry)
    }, [shippingCountry])

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
    }, [shippingSubdivision])

    return (
        <>
            <Typography variant='h6' gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <FormInput control={control} name='firstname' label='First Name' />
                        <FormInput control={control} name='lastname' label='Last Name' />
                        <FormInput control={control} name='address1' label='Address' />
                        <FormInput control={control} name='email' label='Email' />
                        <FormInput control={control} name='city' label='City' />
                        <FormInput control={control} name='zip' label='ZIP / Postal code' />

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map(country => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {subdivisions.map(subdivision => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {options.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                    </Grid>

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} to='/cart' variant='outlined'>Back to cart</Button>
                        <Button type='submit' variant='contained' color='primary'>Next</Button>
                    </div>

                </form>
            </FormProvider>
        </>
    )
};

export default AddressForm;
