import React, { Component } from 'react'
import { view, Link } from 'react-stax'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import appStore from './appStore'

const productStyle = {
  width: 400,
  maxWidth: '90%',
  margin: 15
}

const productMediaStyle = {
  height: 200,
  backgroundColor: 'lightgray'
}

function Product ({ product }) {
  const { isLoggedIn } = appStore
  const { name, description, price, currency, available, id } = product
  const image = `https://picsum.photos/400/600?image=${name.charCodeAt(0) +
    name.charCodeAt(5)}`

  return (
    <Card style={productStyle}>
      <CardHeader
        avatar={<span />}
        title={name}
        subheader={`${price} ${currency}`}
        action={
          isLoggedIn && (
            <Link to='/product' params={{ id }}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          )
        }
      />
      <CardMedia
        style={productMediaStyle}
        image={image}
        title='Contemplative Reptile'
      />
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}

export default view(Product)
