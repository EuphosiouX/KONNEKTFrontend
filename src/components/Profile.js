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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [name, setName] = useState('');
    const [bdate, setBdate] = useState(new Date());
    const [gender, setGender] = useState('Female');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [desc, setDesc] = useState('');
    const [pref, setPref] = useState([]);
    const [prefString, setPrefString] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { upEmail, upPassword, currentUser } = useAuth();

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
                        setFirstName(profiles[i].name.split(' ')[0])
                        setLastName(profiles[i].name.split(' ')[1])
                        setBdate(profiles[i].birth_date)
                        setGender(profiles[i].gender)
                        setImage(profiles[i].image)
                        setDesc(profiles[i].desc)
                        if(profiles[i].lang_preference !== (undefined || null)){
                            setPref(profiles[i].lang_preference.split(', '))
                            setPrefString(profiles[i].lang_preference)
                        }
                        else{
                            setPref([])
                            setPrefString('')
                        }
                        if(pass !== currentUser.uid || email !== currentUser.email){
                            await fetch('/jobseeker/' + profiles[i].id + '/', {
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

    const dateStyle = (date) => {
        let dd = date.getDate();
        let mm = date.getMonth()+1;
        const yyyy = date.getFullYear();

        if(dd<10){
            dd = '0' + dd
        }

        if(mm<10){
            mm = '0' + mm
        }

        return setBdate(yyyy + '-' + mm + '-' + dd)
    }

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        window.location.reload()
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        let stringPref = ''

        try{
            setError('')
            setLoading(true)

            if(desc.length < 1 || firstName.length < 1 || lastName.length < 1 || pref.length < 1){
                handleClose()
            }

            else{
                for(let i=0; i<pref.length; i++){
                    if(i+1 === pref.length){
                        stringPref += pref[i]
                    }
                    else{
                        stringPref += (pref[i] + ', ')
                    }
                }        
                await fetch('/jobseeker/' + id + '/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: firstName + ' ' + lastName,
                        birth_date: bdate,
                        gender: gender,
                        desc: desc,
                        lang_preference: stringPref
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

    const handleEditSkill = (skill) => {
        if(pref.includes(skill)){
            setPref(pref => pref.filter(s => s !== skill)) 
        }
        else {
            setPref([...pref, skill]) 
        }
    }

    return (
        <div>
        <Grid container width='450px' height='400px' mx={1} borderRadius='10px' justifyContent="center" onClick={handleOpen} sx={{cursor: 'pointer', backgroundColor: '#008ED3', '&:hover':{boxShadow: '0px 25px 25px rgba(0, 0, 0, 0.1)'}}}>
            <Grid container height='150px' borderRadius='10px' sx={{
                backgroundImage: 'url(https://source.unsplash.com/random/?office,work,company)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'}}
            />
            <Grid container height='250px' width='400px' mt={-12} justifyContent='center' textAlign='center'>
                <Avatar src={image} sx={{ width: 160, height: 160, border: "6px solid #008ED3" }}/>
                <Grid container justifyContent='center'>
                    <Typography variant='body' fontWeight='700' fontSize='25px' color='white'>{firstName} {lastName}</Typography>
                </Grid>
                <Grid container justifyContent='center'>
                    <Typography variant='body' color='white'>{desc}</Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent='center'>
                <Typography variant='body' fontSize='20px' color='white'>Language:</Typography>
            </Grid>
            <Grid container justifyContent='center' textAlign='center'>
                <Typography variant='body' color='white'>{prefString}</Typography>
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
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant='filled'
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant='filled'
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Birth Date"
                                value={bdate}
                                onChange={(e) => dateStyle(e)}
                                renderInput={(params) => <TextField variant='filled' fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Gender</FormLabel>
                                <RadioGroup     
                                    row
                                    defaultValue="Female"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container> 
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            fullWidth
                            multiline
                            rows={4}
                            variant='filled'
                            label="Profile Description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Typography variant='body' fontSize='20px'>Skills</Typography>
                    <Box display='flex'>
                        {skillList.map((skill) => (
                            <Box 
                            key={skill} 
                            onClick={() => handleEditSkill(skill)} 
                            sx={
                                pref.includes(skill) 
                                ? 
                                {
                                    margin: 0.5, 
                                    padding: 0.75, 
                                    border: '1px solid #0A0B14', 
                                    borderRadius: '5px', 
                                    display: 'inline-block', 
                                    cursor: 'pointer', 
                                    transition: '.2s', 
                                    backgroundColor: '#0A0B14', 
                                    color: 'white',
                                    '&:hover':{
                                        backgroundColor: 'white', 
                                        color: '#0A0B14'
                                    }
                                } 
                                : 
                                {
                                    margin: 0.5, 
                                    padding: 0.75, 
                                    border: '1px solid #0A0B14', 
                                    borderRadius: '5px', 
                                    display: 'inline-block', 
                                    cursor: 'pointer', 
                                    transition: '.2s', 
                                    '&:hover':{
                                        backgroundColor: '#0A0B14',
                                        color: 'white'
                                    }
                                }
                            }>
                                {skill}
                            </Box>
                        ))}
                    </Box>
                </Box>
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