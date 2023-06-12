import React , {useState , useEffect} from "react";
import axios from "axios";
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid, Pagination, ThemeProvider } from "@mui/material";
import ResultCard from "../ResultCard";
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setCurrentSearch , setWishlist } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/language";
import SortAndFilter from "./SortAndFilter";
import { enhanceText } from "../../Utils/enhanceText";
import Filter from "../Filter";
import Sort from "../Sort";
import { muiColors } from "../../Utils/muiTheme";
import filterAndSorting from "../functions/filterAndSorting";
import { languageAdapter } from "../functions/languageAdapter";
 
const Results = () => {
    const db = getFirestore(app);
    const auth = getAuth(app); // instance of auth method
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.language);
    const { currentSearch , wishlist } = useAppSelector(state => state.search);
    const { user } = useAppSelector(state => state.auth);
    const router = useRouter();
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [reloadFlag , setReloadFlag] = useState(false);
    //
    const [rawResults , setRawResults] = useState([]);
    const [toViewResults , setToViewResults] = useState([]); // filtered list
    const [searchLimit , setSearchLimit] = useState(20);
    const [currentPage , setCurrentPage] = useState(1);
    const [lastPage , setLastPage] = useState(0);
    const [lastSearch , setLastSearch] = useState('');
    //
    const [filterOptions , setFilterOptions] = useState({});
    const [filtersApplied, setFiltersApplied] = useState(0);
    const [filterModal , setFilterModal] = useState(false);
    const [resetFlag , setResetFlag] = useState(false);
    // -- sorting components --
    const [sortingModal , setSortingModal] = useState(false);
    const [sortsApplied, setSortsApplied] = useState(0);
    const [sorts , setSorts] = useState([]);
    const [availableSorts , setAvailableSorts] = useState(0); // la cantidad de sorts disponibles para mapear los select

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingFlag(true);
                const querySearch = router.query.id;
                const queryLanguage = router.query.lan;
                dispatch(setCurrentSearch(querySearch)); // write redux variable - avoid refresh
                dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                console.log(`${endpoints('results')}${querySearch}&language=${languageAdapter(queryLanguage)}&limit=${searchLimit}&page=${currentPage}`);
                const rsp = (await axios.get(`${endpoints('results')}${querySearch}&language=${languageAdapter(queryLanguage)}&limit=${searchLimit}&page=${currentPage}`)).data; // get data
                setProducts(rsp.results);
                setRawResults(rsp.results);
                setLastPage(rsp.total_pages);
                setLastSearch(querySearch);
                setLoadingFlag(false);
            } catch (err) {
                console.error(err);
                setLoadingFlag(false);
            }
        };
        if (router.query.id && router.query.lan) {
            fetchData()
        }
    },[router.query.id , router.query.lan , currentPage]);

    useEffect(() => { // for a language change into results section
        const querySearch = router.query.id;
        localStorage.setItem('language', language);
        router.push(`/${language}/results/${querySearch}`)
        // router.push(`/${language}`); // redirect to home into the new language
    },[language]);
    //
    useEffect(() => { // wishlist search
        const fetchData = async () => {
            if (user) {
                try {
                    const q = queryfb(collection(db, "wishlist"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const items = newData.map(item => item["img_id"])
                    dispatch(setWishlist(items)); // set to global state
                } catch (err) {
                    console.error(err);
                }
            }
        };
    fetchData();
    }, [user , reloadFlag])

    // useEffect(() => { // use effect for every filtering or sorting opperation
    //     const filterOptions = {};
    //     const { finalResults } = filterAndSorting(rawResults, filterOptions , sortsApplied , sorts); // filtered and sorted list
    //     setToViewResults(finalResults);
    //     console.log('setted to view results: ' , toViewResults);
    // },[filterOptions, sorts, rawResults, sortsApplied]);

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
                    {/* Filter component */}
                    <Filter 
                        setFilterModal={setFilterModal} 
                        // types={deviceTypes} 
                        // creators={creators} 
                        // statuses={deviceStatus} 
                        // years={deviceCreationYear}
                        // months={deviceCreationMonth}
                        // title={deviceId}
                        // assay={relatedAssay}
                        filterOptions={filterOptions} 
                        setFilterOptions={setFilterOptions} 
                        setFiltersApplied={setFiltersApplied}
                        filterModal={filterModal}
                    />
                    {/* Sorting component */}
                    <Sort 
                        sortingModal={sortingModal}
                        setSortingModal={setSortingModal}
                        setSortsApplied={setSortsApplied}
                        sorts={sorts}
                        setSorts={setSorts}
                        availableSorts={availableSorts}
                        setAvailableSorts={setAvailableSorts}
                    />

                    <div className='flex flex-col lg:flex-row lg:justify-between mt-25'>
                        <div className='mx-5'>
                            <h6 className='text-black text-4xl leading-10 font-semibold'>{enhanceText(lastSearch.split('-').join(' '))}</h6>
                        </div>
                        {/* Buttons for filtering and sorting modal enabling */}
                        <SortAndFilter 
                            filtersApplied={filtersApplied} 
                            sortsApplied={sortsApplied} 
                            setFilterModal={setFilterModal} 
                            setSortingModal={setSortingModal}
                        />
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

export default Results;