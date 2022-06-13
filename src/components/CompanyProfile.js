import { React, useState, useEffect } from 'react'
import { Alert, Button, Typography, Avatar, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, IconButton  } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';

const Profile = () => {

    const skillList = [
        'Python',
        'C++',
        'C',
        'Java',
        'Javascript',
        'Node',
        'SQL',
        'HTML',
        'CSS'
    ]

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState();
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPass, setCompanyPass] = useState('');
    // const [desc, setDesc] = useState('');
    // const [pref, setPref] = useState([]);
    // const [prefString, setPrefString] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { upEmail, upPassword, currentUser } = useAuth();

    useEffect(() => {

        let handleFetch = async () => {
            try{
                const res = await fetch('/jobpost/', {
                    method: 'GET',
                })
                const profiles = await res.json()
                for(let i=0; i<profiles.length; i++){
                    if(profiles[i].email === currentUser.email){
                        setId(profiles[i].id)
                        setCompanyName(profiles[i].company_name)
                        setAddress(profiles[i].address)
                        setPhoneNo(profiles[i].phone_no)
                        setCompanyEmail(profiles[i].email)
                        setCompanyPass(profiles[i].password)
                        // if(profiles[i].lang_preference !== (undefined || null)){
                        //     setPref(profiles[i].lang_preference.split(', '))
                        //     setPrefString(profiles[i].lang_preference)
                        // }
                        // else{
                        //     setPref([])
                        //     setPrefString('')
                        // }
                        if(companyPass !== currentUser.uid || companyEmail !== currentUser.email){
                            await fetch('/jobpost/' + profiles[i].id + '/', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: currentUser.email,
                                    password: currentUser.uid
                                })
                            })
                        }
                        break
                    }
                }
                setLoading(false)
            } catch (err){
                console.log(err)
            }
        }
        handleFetch()
    }, []);


    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        window.location.reload()
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()

        try{
            setError('')
            setLoading(true)

            if(companyName.length < 1 || address.length < 1 || phoneNo.length < 1){
                handleClose()
            }

            else{  
                await fetch('/jobpost/' + id + '/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        company_name: companyName,
                        address: address,
                        phone_no: phoneNo,
                    })
                })
            }
        }catch (err){
            setError('Unexpected error occured')
            console.log(err)
        }
        setLoading(false)
        handleClose()
    }

    return (
        <div>
        <Grid container width='450px' height='400px' mx={1} borderRadius='10px' justifyContent="center" onClick={handleOpen} sx={{cursor: 'pointer', backgroundColor: '#008ED3', '&:hover':{boxShadow: '0px 25px 25px rgba(0, 0, 0, 0.1)'}}}>
            <Grid container height='200px' borderRadius='10px' sx={{
                backgroundImage: 'url(https://source.unsplash.com/random/?office,work,company)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'}}
            />
            <Grid container width='400px' mt={-6} justifyContent='center'>
                <Grid container justifyContent='center'>
                    <Typography variant='body' fontWeight='700' fontSize='20px' color='white'>Company Name:</Typography>
                </Grid>
                <Grid container justifyContent='center'>
                    <Typography variant='body' color='white'>{companyName}</Typography>
                </Grid>
                <Grid container justifyContent='center'>
                    <Typography variant='body' fontWeight='700' fontSize='20px' color='white'>Address:</Typography>
                </Grid>
                <Grid container justifyContent='center'>
                    <Typography variant='body' color='white'>{address}</Typography>
                </Grid>
                <Grid container justifyContent='center'>
                    <Typography variant='body' fontWeight='700' fontSize='20px' color='white'>Phone Number:</Typography>
                </Grid>
                <Grid container justifyContent='center' textAlign='center'>
                    <Typography variant='body' color='white'>{phoneNo}</Typography>
                </Grid>
            </Grid> 
        </Grid>

{/*---------------------------------------------------------------------------------------------------------------------------------------*/}

        <Dialog open={isOpen} fullWidth>
            <DialogTitle variant='body'>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    Update Profile
                    <IconButton onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity='error'>{error}</Alert>}
                <Grid container spacing={2}>
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
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mx={2} mb={1}>
                    <Typography color='red' variant='subtitle'>*Only change the one you want to update</Typography>
                    <Button disabled={loading} variant='contained' sx={{backgroundColor:'#008ED3'}} onClick={handleUpdateProfile}>Update</Button>
                </Box>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default Profile