import { Box, CardActions, CardMedia, CircularProgress, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setFocusedCard } from "../../../redux/features/actions/search";
import { logos } from "../../Utils/logos";
import Image from "next/image";
import { enhanceText } from "../../Utils/enhanceText";
import { Toaster, toast } from "sonner";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../services/firebase";
import { wishlistChange } from "./../functions/wishlistChange";
import { setWishlist } from "../../../redux/features/actions/search";
import Swal from 'sweetalert2';
import { swalNoInputs } from "../../Utils/swalConfig";
import axios from "axios";
import { endpoints } from "../../../config/endpoints";
import { useRouter } from "next/router";
import { setLanguage } from "../../../redux/features/actions/language";
import CarouselComp from "./CarouselComp";
import Head from "next/head";
import ExploreCarousel from "./ExploreCarousel";
import arrow from "../../../public/Arrow1.svg";

const Explore = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { translations , language } = useAppSelector(state => state.language);
    const { wishlist } = useAppSelector(state => state.search);
    const [loadingFav , setLoadingFav] = useState(false);
    const [currentProduct , setCurrentProduct] = useState({});
    const [similarProducts , setSimilarProducts] = useState([]);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const completeQuery = router.query.id;
            const currentArray = completeQuery.split(' ');
            const currentId = currentArray[1];
            // const currentId = router.query.id;
            const currentLanguage = router.query.lan;
            // traer el de la query
            try {
                const currentIdProduct = (await axios.get(`${endpoints('dedicatedProduct')}${currentId}`)).data;
                setCurrentProduct(currentIdProduct.result)
                console.log('results from dedicated product: ', currentIdProduct.result)
                // traer los similares
                const similars = (await axios.get(`${endpoints('similarProducts')}${currentId}`)).data;
                console.log('similars: ', similars)
                setSimilarProducts(similars.results);
                dispatch(setLanguage(currentLanguage)); // write redux variable - avoid refresh
                localStorage.setItem('language',currentLanguage.toLowerCase());
                setLoading(false);    
            } catch (err) {
                setLoading(false);
            }
        }
        setLoading(true);
        if (router.query.id && router.query.lan) {
            fetchData();
        }
    },[router.query.id , router.query.lan]) //eslint-disable-line

    const handleAddWishlist = async (event) => {
        event.stopPropagation();
        if (user) {
          setLoadingFav(true);
          const response = await wishlistChange(currentProduct.id , user , wishlist);
          if(response === 'added'){
            let newWishlist = [...wishlist];
            newWishlist.push(currentProduct.id);
            dispatch(setWishlist(newWishlist))
            setLoadingFav(false);
          } else if (response === 'deleted') {
            let newWishlist = [...wishlist];
            const index = newWishlist.findIndex(item => item === currentProduct.id);
            newWishlist.splice(index, 1); // 2nd parameter means remove one item only
            dispatch(setWishlist(newWishlist))
            setLoadingFav(false);
          }
        } else {
          Swal.fire({
            ...swalNoInputs,
            text: "You're not logged in",
            confirmButtonText: "Oh right"
          })
        }
      };
    const handleVisitSite = () => {
        logEvent(analytics, 'select_content', {
          content_type: 'product',
          content_id: currentProduct.shop_link
        });
        window.open(currentProduct.shop_link, '_blank');
    };
    const handleCopyToClipboard = () => {
        logEvent(analytics, 'select_content', {
            content_type: 'copy_to_clipboard',
            content_id: currentProduct.shop_link
        });
        navigator.clipboard.writeText(currentProduct.shop_link);
        toast.success('Copied to clipboard')    
    };
    const redirectToBrand = (brandName) => {
        window.open(`/${language}/results/${brandName}?brands=${brandName.split('&').join('%26')}&page=1`, '_ blank')       
    };
    
    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
            { loading ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            :
                <>
                    {!loading && currentProduct.id ? 
                        <>
                            <Head>
                                {currentProduct?.name && <title>{`Dokusō - ${enhanceText(currentProduct.name)}`}</title>}
                                {currentProduct?.name && <meta name="description" content={enhanceText(currentProduct.name)}/>}
                                {currentProduct?.brand && <meta name="brand" content={enhanceText(currentProduct.brand)}/>}
                                {currentProduct?.category && <meta name="section" content={enhanceText(currentProduct.section)}/>}
                            </Head>
                            <section className="flex lg:flex-row flex-col w-full items-center mt-4">
                                <div className="lg:w-1/2 lg:px-5 w-full flex flex-col items-center justify-start">
                                    <ExploreCarousel images={currentProduct.img_url}/>
                                </div>
                                <section className="lg:w-1/2 w-full h-full px-5 mt-8 lg:mt-0 flex flex-col items-start justify-start">
                                    <span className='text-xl font-semibold mb-6'>{`${enhanceText(currentProduct.name)}`}</span>
                                    <div className="flex flex-row items-start justify-between w-full">
                                        <Image
                                            src={logos[currentProduct?.brand?.toLowerCase()]} 
                                            alt={currentProduct?.brand} 
                                            sizes="100vw" 
                                            height={0} 
                                            width={0} 
                                            style={{height: '32px' , width: 'auto' , objectFit: 'contain', alignSelf:'start', marginBottom: 24 }}
                                        />
                                        <div className="flex flex-row items-center justify-start hover:underline text-sm" onClick={() => redirectToBrand(currentProduct.brand)}>
                                            <span className="cursor-pointer mr-2">
                                                {`Search for `} <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-dokuso-pink to-dokuso-orange">{`${currentProduct?.brand} `}</span> {`brand`}
                                            </span>
                                            <Image
                                                src={arrow} 
                                                alt={'arrow'} 
                                                height={0} 
                                                width={0} 
                                                style={{height: '8px' , width: 'auto' , objectFit: 'contain', rotate: '180deg' }}
                                            />
                                        </div>
                                    </div>
                                    {
                                        currentProduct.sale ? 
                                        <div className='flex flex-col mb-6'>
                                            <div className="flex flex-row">
                                                <span className='font-semibold text-dokuso-pink mr-1'>{`${currentProduct.currency} ${currentProduct.price}`}</span> 
                                                <span className='line-through text-xs self-center mr-6'>{`${currentProduct.currency} ${currentProduct.old_price}`}</span> 
                                            </div>
                                            <span className="font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-dokuso-pink to-dokuso-blue">{`${parseInt(currentProduct.discount_rate*100)}% OFF`}</span>
                                        </div>
                                        : 
                                        <span className='font-semibold mb-6'>{currentProduct.price !== 0 ? `${currentProduct.currency} ${currentProduct.price}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
                                    }
                                    {(currentProduct.desc_1 !== '' || currentProduct.desc_2 !== '') && <span className="text-lg font-semibold mb-2">Description</span>}
                                    {currentProduct.desc_1 !== '' && 
                                        <div className="mb-6">{enhanceText(currentProduct.desc_1)}</div>
                                    }
                                    {currentProduct.desc_2 !== '' && 
                                        <div className="mb-6">{enhanceText(currentProduct.desc_2)}</div>
                                    }
                                    {currentProduct.category !== '' && <span className="text-lg font-semibold mb-2">Product category</span>}
                                    {currentProduct.category !== '' && 
                                        <div className="mb-6">{enhanceText(currentProduct.category)}</div>
                                    }
                                    <div className='flex flex-col h-fit flex-none p-0 w-full'>
                                        <Toaster richColors/>
                                        <CardActions disableSpacing sx={{padding: 0}}>
                                        <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)} placement="bottom" arrow={true} onClick={(event) => {handleAddWishlist(event)}}>
                                            <IconButton>
                                            { loadingFav ?
                                                <CircularProgress style={{'color': "#FA39BE"}} size={24} thickness={4}/> 
                                            :
                                                wishlist.includes(currentProduct.id) ? 
                                                <FavoriteIcon style={{'color': "#FA39BE"}} /> : 
                                                <FavoriteBorderOutlinedIcon/>
                                            }
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip 
                                            title={enhanceText(translations?.results?.copy_to_clipboard)} 
                                            placement="bottom" 
                                            arrow={true}  
                                            onClick={handleCopyToClipboard}
                                        >
                                            <IconButton aria-label="share">
                                            <ShareIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            title={enhanceText(translations?.results?.visit_site)}  
                                            placement="bottom" 
                                            arrow={true}  
                                            onClick={handleVisitSite}
                                        >
                                            <IconButton>
                                            <StorefrontIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        </CardActions>
                                    </div>
                                </section>
                            </section>
                            {
                                similarProducts?.length > 0 &&
                                <section className="w-full px-4 mt-10">
                                    <h6 className='text-dokuso-black text-lg md:text-xl leading-10 font-semibold'>Related products</h6>
                                    <CarouselComp similarProducts={similarProducts}/>                                    
                                </section>
                            }
                        </>
                    : 
                        <section>No results for this search</section>
                    }
                </>
            }

        </Box>
    )
};

export default Explore;