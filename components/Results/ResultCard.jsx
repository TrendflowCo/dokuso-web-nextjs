import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { logos } from '../Utils/logos';
import Image from 'next/image';
import { enhanceText } from '../Utils/enhanceText';
import { Tooltip } from '@mui/material';

const ResultCard = ({productItem}) => {
  const [showFocused , setShowFocused] = useState(false);
  const handleShowSingleCard = () => {
    console.log('showing card: ' , productItem);
    // use dialog from MUI
    setShowFocused(true);
  };
  const handleAddWishlist = (event) => {
    event.stopPropagation();
    console.log('add to wishlist this item: ' , productItem.id)
  };
  const handleShareItem = (event) => {
    event.stopPropagation();
    console.log('share this item: ' , productItem.id)
  };

  return (
    <Card 
      sx={{ height: 650 , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , justifyContent: 'space-between' }} 
      className='shadow-lg flex-none'
      onClick={() => {handleShowSingleCard()}}
    >
      <section className='flex flex-col w-full h-full'>
        <div className='flex flex-row items-center justify-start w-full h-20 py-2 px-4'>
          <div className='w-full h-full flex flex-col justify-center items-start'>
            <Image 
              src={logos[productItem.brand.toLowerCase()]} 
              alt={productItem.brand} 
              height={0} 
              width={0} 
              sizes="100vh" 
              style={{height: '65%' , width: 'auto' , objectFit: 'contain'}}
            />
          </div>
        </div>
        <CardMedia
          component="img"
          image={productItem.img_url}
          alt={productItem.name}
          sx={{ height: 400 , objectFit: 'cover' }}
        />
        <section className='flex flex-row p-4 w-full'>
          <div className='flex flex-col w-full'>
            <p className='pr-2'>{enhanceText(productItem.name)}</p>
            {
              productItem.old_price_float !== productItem.price_float ? 
              <div className='flex flex-row w-full'>
                <span className='font-semibold text-dokuso-pink mr-1'>{productItem.price}</span> 
                <span className='font-semibold line-through'>{`${productItem.old_price}`}</span> 
              </div>
            : 
              <span className='font-semibold'>{productItem.price}</span> 
            }
          </div>
          {productItem.old_price_float !== productItem.price_float && 
            <div className='flex-none w-fit h-fit p-2.5 rounded-xl bg-gradient-to-r from-dokuso-pink to-dokuso-orange'>
              <span className='text-xl font-bold text-dokuso-white'>SALE</span>
            </div>
          }
        </section>
      </section>
      <section className='flex flex-col h-fit w-full flex-none'>
        <CardActions disableSpacing>
          <Tooltip title="Add to wishlist" placement="bottom" arrow={true} onClick={(event) => {handleAddWishlist(event)}}>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share item" placement="bottom" arrow={true}  onClick={(event) => {handleShareItem(event)}}>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </section>
    </Card>
  );
}

export default ResultCard;