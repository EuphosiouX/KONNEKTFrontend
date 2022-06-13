import React, { useEffect, useState } from 'react'
import data from '../data.json'
import Header from './Header'
import Job from './Job';
import { Grid, TextField, Select, MenuItem, Box, Typography, Button, Alert } from '@mui/material';
import Profile from './Profile';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

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

    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [searchString, setSearchString] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [jobPosition, setJobPosition] = useState('');
    const [type, setType] = useState('+');
    const [desc, setDesc] = useState('');
    const [langQualification, setLangQualification] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        let handleFetch = async () => {
            try{
                const ref = await fetch('/jobseeker/?search=' + currentUser.email, {
                    method: 'GET'
                })
                const val = await ref.json()
                if(val.length < 1){
                    navigate('/companydashboard')
                }
                else{
                    navigate('/')
                }
            } catch (err){
                console.log(err)
            }
        }
        handleFetch()
    }, []);

    useEffect(() => {
        let handleFetch = async () => {
            try{
                const ref = await fetch('/jobs/?search=' + searchString, {
                    method: 'GET'
                })
                const val = await ref.json()
                setJobs(val)
            } catch (err){
                console.log(err)
            }
        }
        handleFetch()
    }, [searchString]);

    const handleFilter = async (e) => {
        e.preventDefault()
        let stringLang = ''
        let stringSearch = ''

        for(let i=0; i<langQualification.length; i++){
            if(i+1 === langQualification.length){
                stringLang += langQualification[i]
            }
            else{
                stringLang += (langQualification[i] + '+')
            }
        }        

        stringSearch = `${companyName}+${jobPosition}+${type}+${stringLang}`
        setSearchString(stringSearch)
    }

    const handleReset = () => {
        setSearchString('')
        setCompanyName('')
        setJobPosition('')
        setType('+')
        setLangQualification([])
    }

    const handleEditSkill = (skill) => {
        if(langQualification.includes(skill)){
            setLangQualification(langQualification => langQualification.filter(s => s !== skill)) 
        }
        else {
            setLangQualification([...langQualification, skill]) 
        }
    }

    console.log(jobs)
    console.log(searchString)

    return (
        <div>
            <Header/>
            <Box py={15}>
                <Grid container ml={4} position='fixed'>
                    <Profile/>
                </Grid>
                <Grid container mx={176} position='fixed'>
                    <Grid container width='450px' height='500px' mx={1} px={5} py={3} borderRadius='10px' justifyContent="center" bgcolor='#D1D3D4'>
                        <Grid item xs={12}>
                            <Typography variant='body' fontSize='25px'>Filter Jobs</Typography>
                            <TextField
                                margin="normal"
                                variant='filled'
                                fullWidth
                                label="Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                variant='filled'
                                fullWidth
                                label="Job Position"
                                value={jobPosition}
                                onChange={(e) => setJobPosition(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Select variant='filled' defaultValue={type} fullWidth onChange={(e) => setType(e.target.value)} size='small'>
                                <MenuItem value="Full+Time">Full-Time</MenuItem>
                                <MenuItem value="Part+Time">Part-Time</MenuItem>
                                <MenuItem value="+">Any</MenuItem>
                            </Select>
                        </Grid>
                        <Box>
                            <Grid container justifyContent='center'>
                                <Typography variant='body' fontSize='20px'>Skills</Typography>
                            </Grid>
                            <Grid container display='flex' justifyContent='center'>
                                {skillList.map((skill) => (
                                    <Box 
                                    key={skill} 
                                    onClick={() => handleEditSkill(skill)} 
                                    sx={
                                        langQualification.includes(skill) 
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
                            </Grid>
                        </Box>
                        <Box width='100%' display='flex' justifyContent='space-between' alignItems='center'>
                            <Button variant='contained' onClick={handleFilter} sx={{backgroundColor:'#008ED3'}}>Filter Job</Button>
                            <Button variant='contained' onClick={handleReset} sx={{backgroundColor:'#008ED3'}}>Reset</Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container ml={69} width='800px'>
                    {jobs.map(job => <Job key={job.id} {...job}/>)}
                </Grid>
            </Box>    
        </div>
    )
}

export default Dashboard