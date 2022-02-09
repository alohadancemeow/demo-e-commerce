import React from 'react';
import { TextField, Grid } from '@material-ui/core'
import { Controller, useController } from 'react-hook-form'

const FormInput = ({ control, name, label }) => {


    const {
        field: { onChange, onBlur,value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { touchedFields, dirtyFields }
    } = useController({
        name,
        control,
        rules: { required: true },
        defaultValue: "",
    });

    return (
        <Grid item xs={12} sm={6}>
            {/* <Controller
                control={control}
                name={name}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label={label} />}
            /> */}

            <TextField
                label={label}
                onChange={onChange} // send value to hook form 
                onBlur={onBlur} // notify when input is touched/blur
                value={value} // input value
                name={name} // send down the input name
                inputRef={ref} // send input ref, so we can focus on input when error appear
            />

        </Grid>
    )
};

export default FormInput;
