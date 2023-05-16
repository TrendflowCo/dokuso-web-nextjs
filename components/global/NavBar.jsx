import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../Utils/muiTheme';
import { useAppSelector , useAppDispatch } from '../../redux/hooks';
import { setLogInFlag } from '../../redux/features/actions/auth';

const Navbar = ({ logOut , user }) => {
  const dispatch = useAppDispatch();
  // const {  
  //   setShowModal,
  //   user,
  //   handleResultClick
  // } = React.useContext(ImageContext);
 
  const pages = [
    'About', 
    'Brands',
    // 'SALE (soon)',
    'Blog',
    'Api (SOON)',
  ];
  
  const routes = {
    'Home': '/home',
    'About': '/manifesto',
    'Brands': '/Brands',
    'SALE': '/',
    'Blog': 'https://medium.com/@dokuso.app/',
    'Api': '/',
  }
  const settings_account = [
        'Profile', 
        'Account', 
        'Dashboard', 
        'Logout'
      ];
  

  const handleSearchSale = (e) => {
    handleResultClick('sale');
  };

  const handleModal = () => {
    setShowModal(true)
  };
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleMenuOption = (option) => {
    if (option === 'Logout') {
      logOut()
    }
    handleCloseUserMenu()
  };

  return (
  <ThemeProvider theme={muiColors}>
    <AppBar position="static" color="dokusoWhite" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Title for desktop display */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'dokusoBlack',
              textDecoration: 'none',
            }}
          >
            Dokusō
          </Typography>
          {/* Pages for desktop display */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2 , color:'inherit', display: 'block' }}
                href={routes[page]}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* Menu bar for mobile display */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="dokusoBlack"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                component="a"
                key={page} 
                onClick={page === 'SALE' ? handleSearchSale : handleCloseNavMenu}
                href={routes[page]}
                target="_blank" 
                rel="noopener noreferrer"
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
             
              ))}
            </Menu>
          </Box>
          {/* Title for mobile display */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Dokusō
          </Typography>
          {/* Menu for a logged user */}
          <Box sx={{ flexGrow: 0 }}>
              { user ?
                <Tooltip title="Open settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ p: 0 }}
                  >
                    {/* Here should be the avatar */}
                    <Avatar alt={user.name} src={user.photoURL !== null ? user.photoURL : 'https://www.flaticon.com/free-icon/user_456212?term=user+avatar&page=1&position=1&origin=tag&related_id=456212'} />
                  </IconButton>
                </Tooltip>
              :
                <Button 
                  // onClick={handleModal}
                  onClick={() => dispatch(setLogInFlag(true))}
                  className="hover:text-dokuso-white bg-gradient-to-r from-dokuso-green to-dokuso-blue hover:from-dokuso-pink hover:to-dokuso-orange" variant="contained" 
                  color="dokusoBlack"
                  sx={{fontWeight: 'bold'}}
                  >
                  Log in
                </Button>
              }
            {/* Menu toggle for the logged user */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings_account.map((setting) => (
                // <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <MenuItem key={setting} onClick={() => handleMenuOption(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </ThemeProvider>
  );
}
export default Navbar;