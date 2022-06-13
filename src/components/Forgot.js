import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import logo from '../images/konnekt-logo.png';
import {useAuth} from '../contexts/AuthContext';
import { Alert } from '@mui/material';

const Forgot = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState();
    const { forgot } = useAuth();

    async function handleSubmit(e){
        e.preventDefault()

        // if (pass.length < 8){
        //     return setError('Password must be at least 8 character long')
        // }

        try{
            setMessage('')
            setError('')
            setLoading(true)
            await forgot(email)
            setMessage('Check your inbox to reset your password')
        }
        catch{
            setError('Failed to reset password')
        }

        setLoading(false)
    }

    return (
        <Grid container style={{ height: '100vh' }} justifyContent='center'>
            <Grid item xs={12} sm={8} md={5}>
                <Box
                    sx={{
                        my: 15,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img className="logo" src={logo} alt=""/>
                    {error && <Alert severity='error'>{error}</Alert>}
                    {message && <Alert severity='success'>{message}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant="filled"
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 , backgroundColor: '#008ED3'}}
                        >
                        Reset Password
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/signin" variant="body" sx={{color: '#008ED3'}}>
                                    Sign in
                                </Link>
                            </Grid>
                            <Grid>
                                <Link href="/signup" variant="body" sx={{color: '#008ED3'}}>
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Forgot