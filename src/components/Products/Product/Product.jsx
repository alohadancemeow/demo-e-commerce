import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, CardActions } from '@material-ui/core'
import { AddShoppingCart } from '@material-ui/icons'
import { stripHtml } from 'string-strip-html';

import useStyles from './styles'

const Product = ({ product, onAddToCart }) => {
    // console.log(product);

    const classes = useStyles()

    // get product's info, strip the html tag
    const { id, name, description, price: { formatted_with_symbol }, image: { url } } = product
    const { result } = stripHtml(description)

    return (
        <Card className={classes.root}>

            <CardMedia className={classes.media} image={url} title={name} />

            <CardContent >
                <div className={classes.cardContent}>
                    <Typography variant='h5' gutterBottom>{name} </Typography>
                    <Typography variant='h5' gutterBottom> {formatted_with_symbol} </Typography>
                </div>
                <Typography variant='body2' color='textSecondary' >{result} </Typography>
            </CardContent>

            <CardActions disableSpacing className={classes.cardActions}>
                <IconButton aria-label='Add to cart' onClick={() => onAddToCart(id, 1)}>
                    <AddShoppingCart />
                </IconButton>
            </CardActions>

        </Card>
    )
};

export default Product;
