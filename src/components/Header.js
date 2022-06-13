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

const Header = () => {

    const navigate = useNavigate();
    const [id, setId] = useState();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState();
    const [picture, setPicture] = useState('');
    const [image64, setImage64] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('');
    const [enrollError, setEnrollError] = useState('');
    const [matchError, setMatchError] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenn, setIsOpenn] = useState(false);
    const [isOpennn, setIsOpennn] = useState(false);
    const { logOut, currentUser } = useAuth();
    
    const webcamRef = useRef();

    useEffect(() => {

        let handleFetch = async () => {
            try{
                const res = await fetch('/jobseeker/', {
                    method: 'GET',
                })
                const profiles = await res.json()
                for(let i=0; i<profiles.length; i++){
                    if(profiles[i].email === currentUser.email){
                        setId(profiles[i].id)
                        setName(profiles[i].name)
                        setImage(profiles[i].image)
                        setEmail(profiles[i].email)
                        setPass(profiles[i].password)
                        break
                    }
                }
                setLoading(false)
            } catch (err){
                console.log(err)
                setError('Unexpected error occured')
            }
        }
        handleFetch()
    }, []);

    const toBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImage64(reader.result)
        }
    }

    const handleOpen = async () => {
        setIsOpen(true)
    }

    const handleOpenn = () => {
        setIsOpenn(true)
    }

    const handleOpennn = () => {
        setIsOpennn(true)
    }

    const handleClose = () => {
        setUploadError('')
        setMatchError('')
        setEnrollError('')
        setIsOpen(false)
        window.location.reload()
    }

    const handleClosee = () => {
        setUploadError('')
        setMatchError('')
        setEnrollError('')
        setIsOpenn(false)
    }

    const handleCloseee = () => {
        setUploadError('')
        setMatchError('')
        setEnrollError('')
        setIsOpennn(false)
    }

    const handleUpload = async (file) => {  

        const storeRef = ref(storage, `${name}`)
        try{
            await uploadBytes(storeRef, file)
        }catch (err){
            console.log(err)
            setUploadError('Cannot upload file')
        }
        getDownloadURL(storeRef).then(url => {setImage(url)})
    }

    const handleUpdatePhoto = () => {
        setUploadError('')
        setLoading(true)
        if (imageFile == null){
            setLoading(false)
            return setUploadError('Please add a photo before updating/changing the photo')
        }

        handleUpload(imageFile)
        setLoading(false)
        handleOpenn()
    }

    const handleScreenshot = () => {
        setPicture(webcamRef.current.getScreenshot())
        handleOpennn()
    }

    const handleVerify = async () => {
        setMatchError('')
        setEnrollError('')
        setLoading(true)
        let enrollReply
        let faceId
        let matchReply

        enrollReply = await nodefluxEnrollment(image64)

        if(enrollReply.job.result.status !== ('success' || 'incomplete')){
            enrollReply = await nodefluxEnrollment(image64)
        }

        if(enrollReply.message === 'Face Enrollment Success'){
            faceId = enrollReply.job.result.result[0].create_face_enrollment.face_id
        }
        else{
            setLoading(false)
            return setEnrollError(enrollReply.message)
        }
        
        console.log(faceId)
        console.log(enrollReply.message)
        
        matchReply = await nodefluxMatch(picture, faceId)

        if(matchReply.job.result.status !== ('success' || 'incomplete')){
            matchReply = await nodefluxMatch(picture, faceId)
        }

        if(matchReply.message === 'Face Match Enrollment Success'){
            try{
                const uploadData = new FormData();
                uploadData.append('image', image)
                await fetch('/jobseeker/' + id + '/', {
                    method: 'PUT',
                    body: uploadData
                })
            }catch (err){
                console.log(err)
                setLoading(false)
                return setMatchError('Unexpected error occured')
            }
            handleCloseee()
            handleClosee()
            handleClose()
            setLoading(false)
        }

        else{
            setLoading(false)
            return setMatchError(matchReply.message)
        }
    }

    const handleUpdateProfile = () => {
        navigate('/updatecredentials')
    }

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
                            <Avatar src={image} onClick={handleOpen} sx={{ width: 60, height: 60, border: "1px solid #008ED3", mr: 1, cursor: 'pointer', '&:hover':{boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1)'}}}/>
                            <Link onClick={handleLogout} sx={{color:'#008ED3', fontSize: '20px'}}>Logout</Link>
                        </Box>
                    </Grid> 
                </Grid>
            </AppBar>

{/*---------------------------------------------------------------------------------------------------------------------------------------*/}

            <Dialog open={isOpen} fullWidth>
                <DialogTitle variant='body'>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        Update Credentials/Photo
                        <IconButton onClick={handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                {uploadError && <Alert severity='error'>{uploadError}</Alert>}
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid container item xs={5} alignItems='center'>
                            <Grid item xs={12}>
                                <Avatar src={image} sx={{ width: 150, height: 150, border: "1px solid #008ED3", mr: 1, '&:hover':{boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1)'}}}/>
                                <input type='file' accept='image/jpeg' onChange={(e) => {setImageFile(e.target.files[0]); toBase64(e.target.files[0])}}></input>
                            </Grid>
                            
                        </Grid>
                        <Grid container item xs={7} alignItems='center'>
                            <Grid item xs={12}>
                                <Typography variant='body1' fontWeight={700} fontSize='20px'>Email:</Typography>
                                <Typography variant='body'>{email}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container mb={2}>
                        <Grid container item xs={5} justifyContent='center' alignItems='center'>
                            <Button disabled={loading} variant='contained' sx={{backgroundColor:'#008ED3'}} onClick={handleUpdatePhoto}>Update Photo</Button>
                        </Grid>
                        <Grid container item xs={7} justifyContent='center' alignItems='center'>
                            <Button variant='contained' sx={{backgroundColor:'#008ED3'}} onClick={handleUpdateProfile}>Update Credentials</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog> 

{/*---------------------------------------------------------------------------------------------------------------------------------------*/}

            <Dialog open={isOpenn} fullWidth>
                <DialogTitle variant='body'>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        Take a picture
                        <IconButton onClick={handleClosee}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box justifyContent='center'>
                        <Webcam ref={webcamRef} width='550px' screenshotFormat="image/jpeg"></Webcam>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mx={2} mb={1}>
                        <Typography color='red' variant='subtitle'>*This picture is to verify if the uploaded photo is you and to create your face recognition (camera loading may take a while and please position yourself on the center)</Typography>
                        <Button variant='contained' sx={{backgroundColor:'#008ED3'}} onClick={handleScreenshot}>Take Picture</Button>
                    </Box>
                </DialogActions>
            </Dialog>       

{/*---------------------------------------------------------------------------------------------------------------------------------------*/}

            <Dialog open={isOpennn} fullWidth>
                <DialogTitle variant='body'>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        Verify picture
                        <IconButton onClick={handleCloseee}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                {enrollError && <Alert severity='error'>{enrollError}</Alert>}
                {matchError && <Alert severity='error'>{matchError}</Alert>}
                <DialogContent>
                    <Box display='flex' justifyContent='space-between' alignItems='center' px={10}>
                        <Avatar src={image64} sx={{ width: 150, height: 150, border: "1px solid #008ED3"}}/>
                        <Avatar src={picture} sx={{ width: 150, height: 150, border: "1px solid #008ED3"}}/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box width='100%' display='flex' justifyContent='center' alignItems='center' mx={2} mb={1}>
                        <Button disabled={loading} variant='contained' sx={{backgroundColor:'#008ED3'}} onClick={handleVerify}>Verify Picture</Button>
                    </Box>
                </DialogActions>
            </Dialog>                 
        </header>
    )
}

export default Header