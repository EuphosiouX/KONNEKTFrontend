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

const UpdateCredentials = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [cpass, setCpass] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState();
    const { currentUser, upEmail, upPassword } = useAuth();

    function handleSubmit(e){
        e.preventDefault()

        if (pass.length < 8){
            return setError('Password must be at least 8 character long')
        }

        if (pass !== cpass){
            return setError('Check your confirm password')
        }

        const promises = []
        setLoading(true)
        setError('')

        if (email !== currentUser.email){
            promises.push(upEmail(email))
        }

        if (pass){
            promises.push(upPassword(pass))
        }

        Promise.all(promises)
        .then(() => {
            navigate('/')
        })
        .catch(() => {
            setError('Failed to update account')
        })
        .finally(() => (
            setLoading(false)
        ))
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
                        <Grid container spacing={1} justifyContent='center' mb={1}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Email Address"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={cpass}
                                    onChange={(e) => setCpass(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#008ED3'}}
                        >
                        Update Profile
                        </Button>
                        <Grid container justifyContent='space-between'>
                            <Link href="/" variant="body" sx={{color: '#008ED3'}}>
                                Cancel
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default UpdateCredentials