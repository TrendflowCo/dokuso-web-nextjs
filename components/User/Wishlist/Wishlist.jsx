import React , { useEffect , useState } from "react";
import { app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import axios from "axios";
import ResultCard from "../../Results/ResultCard";
import { useRouter } from "next/router";
import { Box, CircularProgress, Grid, Pagination, ThemeProvider } from "@mui/material";
import { muiColors } from "../../Utils/muiTheme";
  

const Wishlist = () => {
    const db = getFirestore(app);
    const auth = getAuth(app); // instance of auth method
    const [user, loading] = useAuthState(auth); // user data
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [lastPage , setLastPage] = useState(0);
    const [currentPage , setCurrentPage] = useState(1);
    const [reloadFlag , setReloadFlag] = useState(false);
    const router = useRouter();

    useEffect(() => { // ejemplo basico para traerme los IDs de los items que tengo en mi wishlist - solo lo id
        const fetchData = async () => {
            if (user) {
                try {
                    setLoadingFlag(true);
                    const q = queryfb(collection(db, "wishlist"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const items = newData.map(item => item["img_id"])
                    const completeString = items.join(',');
                    const wishlistProducts = await axios.get(`${endpoints('byIds')}${completeString}`);
                    console.log(wishlistProducts.data)
                    setProducts(rsp.results);
                    setLastPage(rsp.total_pages);
                    setLoadingFlag(false);
                } catch (err) {
                    console.error(err);
                }
            }
        };
    fetchData();
    },[router.query.id , router.query.lan , currentPage , user]);
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <> 
            { loadingFlag ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            : 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
                    <div className='flex flex-col lg:flex-row lg:justify-between mt-25'>
                        <div className='mx-5'>
                            <h6 className='text-black text-4xl leading-10 font-semibold'>Wishlist</h6>
                        </div>
                        {/* Buttons for filtering and sorting modal enabling
                        <SortAndFilter 
                            filtersApplied={filtersApplied} 
                            sortsApplied={sortsApplied} 
                            setFilterModal={setFilterModal} 
                            setSortingModal={setSortingModal}
                        /> */}
                    </div>
                    <section>
                        <Grid container spacing={2} sx={{padding: 2}}>
                            {products.length > 0 && products.map((productItem,productIndex) => {return (
                                <Grid key={productIndex} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                                    <ResultCard productItem={productItem} reloadFlag={reloadFlag} setReloadFlag={setReloadFlag}/>
                                </Grid>
                            )})}
                        </Grid>
                    </section>
                    <div className="flex flex-col w-full items-center py-4">
                        <ThemeProvider theme={muiColors}>
                            <Pagination page={currentPage} count={lastPage} onChange={handleChangePage} color="dokusoOrange" />
                        </ThemeProvider>
                    </div>
                </Box>
            }
        </>
    )
};

export default Wishlist;