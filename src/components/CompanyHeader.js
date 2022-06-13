import { React, useState, useEffect, useRef } from 'react'
import logo from '../images/konnekt-logo.png'
import { TextField, Avatar, Link, Button, Fab, AppBar, Box, Grid, Badge,  Select, MenuItem, Alert, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { nodefluxAuthentication, nodefluxEnrollment, nodefluxMatch } from './ReqNodeflux';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase/Config'

const CompanyHeader = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { logOut } = useAuth();

    const handleLogout = async () => {
        setError('')

        try {
            await logOut()
            navigate('/signin')
        } catch {
            setError('Failed to sign out')
        }
    }

    const showAlert = (msg) => {
        alert(msg)
    }

    return (
        <header>
            <AppBar sx={{bgcolor: '#D1D3D4'}}>
                <Grid container justifyContent="center" py={2}>
                    <Grid item xs={11} display="flex" justifyContent="space-between">
                        <Box display="flex" alignItems='center' justifyContent='center'>
                            <Link href='/'><img className="logo" src={logo} alt="" /></Link> 
                        </Box>
                        {error && <Alert severity='error'>{error}</Alert>}
                        <Box display="flex" alignItems='center' justifyContent='center'>
                            <Fab size="small" onClick={() => showAlert('Messaging feature coming soon to Konnekt!')} sx={{bgcolor:'#008ED3'}} color='primary'>
                                <Badge color="secondary" badgeContent={3}>
                                    <MailIcon sx={{color: 'white'}}/>
                                </Badge>
                            </Fab>
                            <Fab size="small" onClick={() => showAlert('Notifications feature coming soon to Konnekt!')} sx={{bgcolor:'#008ED3', mx: 1}} color='primary'>
                                <Badge color="secondary" variant="dot">
                                    <NotificationsIcon sx={{color: 'white'}}/>
                                </Badge>
                            </Fab>
                            <Link onClick={handleLogout} sx={{color:'#008ED3', fontSize: '20px'}}>Logout</Link>
                        </Box>
                    </Grid> 
                </Grid>
            </AppBar>
        </header>
    )
}

export default CompanyHeader