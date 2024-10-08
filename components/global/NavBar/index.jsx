import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { muiColors } from '../../Utils/muiTheme';
import TitleDesktop from './Desktop/TitleDesktop';
import TitleMobile from './Mobile/TitleMobile';
import MenuForUser from './Common/MenuForUser';
import MenuToggleUser from './Common/MenuToggleUser';
import LanAndCountrySelection from './Common/LanAndCountrySelection';
import SearchBar from './Common/SearchBar';
import { Button, Tooltip, IconButton, Box, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { handleSearchQuery } from '../../functions/handleSearchQuery';
import { setCurrentSearch } from '../../../redux/features/actions/search';
import { logOut } from '../../Auth/authFunctions';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../services/firebase';
import { setLogInFlag } from '../../../redux/features/actions/auth';

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { country, language, translations } = useAppSelector(state => state.region);
  const isHomePage = router.pathname === '/[zone]/[lan]';
  const isMobile = useMediaQuery('(max-width:768px)');
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleExplore = () => {
    if (translations?.prompts) {
      const promptValues = Object.values(translations.prompts);
      const randomTerm = promptValues[Math.floor(Math.random() * promptValues.length)];
      dispatch(setCurrentSearch(randomTerm));
      handleSearchQuery(country, language, randomTerm, 'explore', router);
    }
  };

  const handleOpenMoreMenu = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
  };

  const handleLoginLogout = () => {
    if (user) {
      logOut();
    } else {
      dispatch(setLogInFlag(true));
    }
    handleCloseMoreMenu();
  };

  return (
    <ThemeProvider theme={muiColors}>
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{
          background: isHomePage ? 'transparent' : 'linear-gradient(to right, #FF6B6B, #4ECDC4)',
          transition: 'background 0.3s ease-in-out',
          boxShadow: isHomePage ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image src="/logo_tf.png" alt="TrendFlow Logo" width={50} height={50} />
              {isMobile ? <TitleMobile /> : <TitleDesktop />}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center', maxWidth: { xs: '60%', sm: '70%', md: '50%' } }}>
              <SearchBar />
              <Tooltip title="Explore new ideas">
                <IconButton
                  onClick={handleExplore}
                  sx={{
                    ml: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <span role="img" aria-label="sparkles">✨</span>
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile ? (
                <>
                  <LanAndCountrySelection loading={loading} />
                  {user ? (
                    <>
                      <MenuForUser 
                        loading={loading} 
                        user={user} 
                        anchorElUser={anchorElUser} 
                        setAnchorElUser={setAnchorElUser}
                      />
                      <MenuToggleUser 
                        setAnchorElUser={setAnchorElUser} 
                        anchorElUser={anchorElUser} 
                        logOut={logOut}
                      />
                    </>
                  ) : (
                    <Button 
                      onClick={() => dispatch(setLogInFlag(true))}
                      variant="contained" 
                      startIcon={<LoginIcon />}
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: 20,
                        padding: '8px 16px',
                        background: 'linear-gradient(to right, #FF8E53, #FE4B8D)',
                        '&:hover': {
                          background: 'linear-gradient(to right, #FF6B6B, #4ECDC4)',
                        },
                      }}
                    >
                      {translations?.login?.log_in || 'Log In'}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Tooltip title={user ? "Logout" : "Login"}>
                    <IconButton
                      onClick={handleLoginLogout}
                      sx={{ 
                        mr: 1,
                        color: 'white',
                      }}
                    >
                      {user ? <LogoutIcon /> : <LoginIcon />}
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={handleOpenMoreMenu}
                    sx={{
                      color: 'white',
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </AppBar>

      <Menu
        anchorEl={anchorElMore}
        open={Boolean(anchorElMore)}
        onClose={handleCloseMoreMenu}
      >
        <MenuItem onClick={handleCloseMoreMenu}>
          <LanAndCountrySelection loading={loading} />
        </MenuItem>
        {user && (
          <MenuItem onClick={handleCloseMoreMenu}>
            <Link href="/profilePage">
              Wishlists
            </Link>
          </MenuItem>
        )}
      </Menu>
    </ThemeProvider>
  );
};

export default Navbar;