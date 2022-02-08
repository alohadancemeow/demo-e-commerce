import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'

import { commerce } from '../../lib/commerce';

import FormInput from './CustomTextField'

const AddressForm = ({ checkoutToken }) => {

    // # States
    const [shippingCountries, setShippingCountries] = useState([])
    const [shippingCountry, setShippingCountry] = useState('')
    const [shippingSubdivisions, setShippingSubdivisions] = useState([])
    const [shippingSubdivision, setShippingSubdivision] = useState('')
    const [shippingOptions, setShippingOptions] = useState([])
    const [shippingOption, setShippingOption] = useState('')
    // console.log(shippingCountries);

    // # Fetch
    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
        console.log('countries', countries);

        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }

    // get countries' key,name --> 'TH' : 'Thailand'
    const countries = Object.entries(shippingCountries)
        .map(([code, name]) => ({ id: code, label: name }))
    console.log(countries);

    // # Hooks
    const methods = useForm()
    const { control, handleSubmit, formState: { errors } } = methods

    const onSubmit = data => console.log(data);


    // # Effect
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    }, [])

    return (
        <>
            <Typography variant='h6' gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <FormInput control={control} required name='firstname' label='First Name' />
                        <FormInput control={control} required name='lastname' label='Last Name' />
                        <FormInput control={control} required name='address' label='Address' />
                        <FormInput control={control} required name='email' label='Email' />
                        <FormInput control={control} required name='city' label='City' />
                        <FormInput control={control} required name='zip' label='ZIP / Postal code' />

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

                        {/* <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={ } fullWidth onChange={ }>
                                <MenuItem key={ } value={ }>
                                    Select me
                                </MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={ } fullWidth onChange={ }>
                                <MenuItem key={ } value={ }>
                                    Select me
                                </MenuItem>
                            </Select>
                        </Grid> */}

                    </Grid>
                </form>
            </FormProvider>
        </>
    )
};

export default AddressForm;
