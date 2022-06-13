import { React, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const CompanyJob = (job) => {

    const handleDelete = async () => {
        try{
            await fetch('/jobs/' + job.id, {
                method: 'DELETE'
            })
        }catch (err){
            console.log(err)
        }
        window.location.reload()
    }

    return (
        <Grid height='125px' container pb={1} justifyContent="center">
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
                        <Button variant="outlined" color='error' onClick={handleDelete} sx={{mt: 2}}>Delete</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default CompanyJob