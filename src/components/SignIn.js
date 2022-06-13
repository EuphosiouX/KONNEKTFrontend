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

const SignIn = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState();
    const { signIn } = useAuth();

    async function handleSubmit(e){
        e.preventDefault()

        if (pass.length < 8){
            return setError('Password must be at least 8 character long')
        }

        try{
            setError('')
            setLoading(true)
            await signIn(email, pass)
            navigate('/')            
        }
        catch (err){
            setError('Failed to sign in')
            console.log(err)
        }

        setLoading(false)
    }

    return (
        <Grid container style={{ height: '100vh' }}>
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
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant="filled"
                            label="Email Address"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant="filled"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <Button
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 , backgroundColor: '#008ED3'}}
                        >
                        Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot" variant="body" sx={{color: '#008ED3'}}>
                                    Forgot password?
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
            <Grid item
                sm={4}
                md={7}
                style={{
                backgroundImage: 'url(https://source.unsplash.com/random/?office,work,company)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'}}
            />
        </Grid>
    );
}

export default SignIn