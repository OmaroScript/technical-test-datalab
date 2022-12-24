import * as React from 'react';
import { Box } from '@mui/system';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth0 } from '@auth0/auth0-react';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Graph from './Graph';
import Data from './data.json';

const styles = makeStyles({
    marginButton: {
        margin: '1rem'
    },
    centerItems: {
        textAlign: 'center'
    }
 });
 

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backgroundColor: '#30302f',
    color: 'white'
  };

export const Dashboard = () => {
    const classes = styles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [category, setCategory] = React.useState("");

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { logout, isAuthenticated } = useAuth0();

    // Modal
    const [openModal, setOpen] = React.useState(false);
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);
    const handleClickModal = () => {
        handleClose();
        handleOpenModal();
    };

    return ( 
        isAuthenticated && (
            <React.Fragment>
                <Router>
                <Box>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={handleClick}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClickModal}>Salir</MenuItem>
                            </Menu>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                BIENVENIDO
                            </Typography>
                            <Button color="inherit" alt="cerrar sesion" onClick={() => logout({ returnTo: window.location.origin })}>Cerrar Sesión</Button>
                        </Toolbar>
                    </AppBar>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className={classes.centerItems}
                    >
                        <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            ¿Desea salir del proyecto?
                        </Typography>
                        <Button variant="contained" className={classes.marginButton} onClick={() => logout({ returnTo: window.location.origin })}>ACEPTAR</Button>
                        <Button variant="contained" className={classes.marginButton} onClick={handleCloseModal}>CANCELAR</Button>
                        </Box>
                    </Modal>
                </Box>
                </Router>
                <div style={{padding: "3rem"}}>
                    <Graph
                        data={Data}
                        selectedCategoryName={category}
                        onSelectCategory={setCategory}
                    />
                </div>
            </React.Fragment>
    ));
};