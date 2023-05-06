import React from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
import PopularSearches from '../PopularSearches';
import FashionForward from '../FashionForward';
import FeatureImages from '../FeatureImages';
import SecondaryLogin from '../SecondaryLogin';
import Footer from '../../global/Footer';

const Home = () => {
    return (
      <div className='px-4 sm:px-0'>
        <TitleAndImage/>
        <Searcher/>
        <PopularSearches/>
        <FashionForward/>
        <FeatureImages/>
        <SecondaryLogin/>
        <Footer/>
      </div>
    )
};

export default Home;