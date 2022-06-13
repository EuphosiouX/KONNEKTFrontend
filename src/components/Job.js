import { React, useState, useEffect } from 'react';
import { Alert, Button, Typography, Avatar, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, IconButton, Link } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';

const Job = (job) => {

    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {

        let handleFetch = async () => {
            try{
                const res = await fetch('/jobseeker/', {
                    method: 'GET',
                })
                const profiles = await res.json()
                for(let i=0; i<profiles.length; i++){
                    if(profiles[i].email === currentUser.email){
                        if(profiles[i].image !== (undefined || null)){
                            setImage(profiles[i].image)
                        }
                        break
                    }
                }
            } catch (err){
                console.log(err)
            }
        }
        handleFetch()
    }, [Job]);

    const handleOpen = () => {
        if(image.length < 1){
            return alert('Please upload and verify your photo first before choosing a job!')
        }
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
            <Grid container height='125px' pb={1} justifyContent="center">
                <Grid container item px={3} py={2} border="1px solid #D1D3D4" borderRadius='10px' alignItems='center' sx={{cursor: 'pointer', transition: '.3s', backgroundColor: '#D1D3D4', '&:hover':{boxShadow: '0px 5px 25px rgba(0, 0, 0, 0.1)', borderLeft: '6px solid #008ED3'}}}>
                    <Grid item xs>
                        <Typography variant="body1">{job.job_position}</Typography>
                        <Typography variant="body" sx={{bgcolor: '#008ED3', padding: 0.75, borderRadius: '5px', display: 'inline-block', color: 'white'}}>{job.company_name}</Typography>
                    </Grid>
                    <Grid container item xs>
                        {job.lang_qualification.split(', ').map((language) =>(
                            <Grid item key={language} sx={{bgcolor: '#0A0B14', margin: 0.5, padding: 0.75, borderRadius: '5px', color: 'white', display: 'inline-block'}}>
                                {language}
                            </Grid>                        
                        ))}
                    </Grid>
                    <Grid item xs>
                        <Grid container justifyContent='flex-end'>
                            <Typography variant="body1">{job.type}</Typography>
                        </Grid>
                        <Grid container justifyContent='flex-end'>
                            <Button variant="outlined" onClick={handleOpen} sx={{mt: 2}}>Check</Button>
                        </Grid>
                    </Grid>
                </Grid>

{/*---------------------------------------------------------------------------------------------------------------------------------------*/}

                <Dialog open={isOpen} fullWidth>
                    <DialogTitle variant='body'>
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            Job details
                            <IconButton onClick={handleClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    variant='filled'
                                    label="Company Name"
                                    value={job.company_name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant='filled'
                                    label="Address"
                                    value={job.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    variant='filled'
                                    label="Job Position"
                                    value={job.job_position}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                        InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    variant='filled'
                                    label="Type"
                                    value={job.type}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                        InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant='filled'
                                    label="Description"
                                    value={job.desc}
                                />
                            </Grid>
                            <Grid container item xs={12}>
                                {job.lang_qualification.split(', ').map((language) =>(
                                    <Grid item key={language} sx={{bgcolor: '#0A0B14', margin: 0.5, padding: 0.75, borderRadius: '5px', color: 'white', display: 'inline-block'}}>
                                        {language}
                                    </Grid>                        
                                ))}
                            </Grid>
                            <Grid container item xs={12}>
                                <Typography variant='body' fontSize='20px'>Contacts</Typography>
                            </Grid>
                            <Grid container item xs={12}>
                                <Typography variant='body'>Email: {<Link href={'mailto:' + job.email}>{job.email}</Link>}</Typography>
                            </Grid>
                                                        <Grid container item xs={12}>
                                <Typography variant='body'>Phone: {<Link href={'tel:' + job.phone_no}>{job.phone_no}</Link>}</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Grid>
    )
}

export default Job