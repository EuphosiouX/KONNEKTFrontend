import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import logo from '../images/konnekt-logo.png';
import {useAuth} from '../contexts/AuthContext';
import { Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Typography } from '@mui/material';

const CompanySignUp = () => {

    const navigate = useNavigate()
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPass, setCompanyPass] = useState('');
    const [cpass, setCpass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState();
    const { signUp } = useAuth();

    let handleSubmit = async (e) => {
        e.preventDefault()

        if (companyPass.length < 8){
            return setError('Password must be at least 8 character long')
        }

        if (companyPass !== cpass){
            return setError('Check your confirm password')
        }

        try{
            setError('')
            setLoading(true)
            await signUp(companyEmail, companyPass)
            handlePost()
            navigate('/companydashboard')
        }
        catch (err){
            setError('Unexpected error occured')
        }

        setLoading(false)
    }

    let handlePost = async () => {
        try{
            const uploadData = new FormData();
            uploadData.append('company_name', companyName)
            uploadData.append('address', address)
            uploadData.append('phone_no', phoneNo)
            uploadData.append('email', companyEmail)
            uploadData.append('password', companyPass)

            await fetch('/jobpost/', {
                method: 'POST',
                body: uploadData
            });
            }

            
        catch (err){
            setError('Unexpected error occured')
            console.log(err)
        }
    }

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item
                sm={4}
                md={7}
                style={{
                backgroundImage: 'url(https://source.unsplash.com/random/?office,work,company)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'}}
            />
            <Grid item xs={12} sm={8} md={5} >
                <Box
                    sx={{
                        my: 15,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img className="logo" src={logo} alt="" />
                    {error && <Alert severity='error'>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                        <Grid container justifyContent='center'>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Company Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Company Phone No"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Company Email"
                                    autoComplete='email'
                                    value={companyEmail}
                                    onChange={(e) => setCompanyEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    type='password'
                                    label="Password"
                                    autoComplete='new-password'
                                    value={companyPass}
                                    onChange={(e) => setCompanyPass(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    type='password'
                                    label="Confirm Password"
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
                        Sign Up
                        </Button>
                        <Grid container justifyContent='space-between'>
                            <Link href="/signin" variant="body" sx={{color: '#008ED3'}}>
                                Already have an account? Sign in
                            </Link>
                            <Link href="/signup" variant="body" sx={{color: '#008ED3'}}>
                                Not a job poster? Sign up as a job seeker
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CompanySignUp