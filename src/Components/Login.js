import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';
import logo from './../logo.svg';
import './../App.css';


export const Login = () => {
    const { loginWithRedirect } = useAuth0();
    

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <Button variant="outlined" size="large" onClick={() => loginWithRedirect()}>Login</Button>
            </header>
        </div>
    );
};