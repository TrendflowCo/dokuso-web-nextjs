import React from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../Utils/muiTheme';
import { useAppDispatch , useAppSelector } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";

const Searcher = () => {
    const dispatch = useAppDispatch();
    const { currentSearch } = useAppSelector(state => state.search);
    const { translations , language , country } = useAppSelector(state => state.region);
    const router = useRouter();
    const handleSearchPhrase = (e) => { // function for setting the phrase. Stores into global state
        dispatch(setCurrentSearch(e.target.value));
    };
    const handleButtonSearch = () => { // click into SHOP NOW button
        event.preventDefault();
        handleSearchQuery(country , language , currentSearch , 'search' , router)
    };
    const handleEnterSearch = (e) => { // click ENTER into form -> redirects to SHOP NOW
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };

    return (
        <div className="flex flex-col items-center max-w-[80%] w-full mx-auto">
            <div className="flex flex-row items-center justify-center flex-wrap items-center w-full py-2">
                <section className="flex-auto w-full lg:w-fit px-4 md:px-0">
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
                    <input 
                        className="bg-dokuso-black bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-4 pr-10 pl-5 relative flex-auto w-full items-center text-dokuso-black"
                        type="text"
                        placeholder={translations?.search?.placeholder}
                        style={{'fontFamily':"Arial, FontAwesome"}}
                        onChange={(e) => {handleSearchPhrase(e)}}
                        onKeyDown={handleEnterSearch}
                    />
                </section>
                <section className="px-2 lg:mt-0 mt-6">
                    <ThemeProvider theme={muiColors}>
                        <Button 
                            className="text-dokuso-white hover:text-dokuso-black bg-gradient-to-r from-dokuso-pink to-dokuso-blue hover:from-dokuso-blue hover:to-dokuso-green" 
                            variant="contained" 
                            onClick={() => handleButtonSearch()} 
                            onKeyDown={(e) => {handleEnterSearch(e)}}
                            sx={{fontWeight: 'bold', height: '56px'}}
                            color="dokusoWhite"
                        >
                            {translations?.searchLabel}
                        </Button>
                    </ThemeProvider>
                </section>
            </div>
        </div>
    
    )
};

export default Searcher;