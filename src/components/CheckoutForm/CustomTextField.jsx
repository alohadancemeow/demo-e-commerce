import React from 'react';
import { TextField, Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

const FormInput = ({control, name, label, required }) => {

    // const { control } = useForm()

    return (
        <Grid item xs={12} sm={6}>
            <Controller
                control={control}
                name={name}
                rules={{
                    required: {
                        value: required,
                        message: 'Field is required.'
                    }
                }}
                render={({ field }) => <TextField {...field} label={label} />}
            />
        </Grid>
    )
};

export default FormInput;
