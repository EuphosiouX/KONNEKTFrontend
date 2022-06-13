import { React, useEffect, useState} from 'react'
import data from '../data.json'
import CompanyHeader from './CompanyHeader'
import CompanyJob from './CompanyJob';
import { Grid, TextField, Select, MenuItem, Box, Typography, Button, Alert } from '@mui/material';
import CompanyProfile from './CompanyProfile';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompanyAddJob = () => {

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

    const [id, setId] = useState();
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPass, setCompanyPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [jobPosition, setJobPosition] = useState('');
    const [type, setType] = useState('Full Time');
    const [desc, setDesc] = useState('');
    const [langQualification, setLangQualification] = useState([]);
    const [langQualificationString, setLangQualificationString] = useState('');
    const { currentUser } = useAuth();

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

    const handlePost = async (e) => {
        e.preventDefault()
        let stringLang = ''

        try{
            setError('')
            setLoading(true)

            if(desc.length < 1 || jobPosition.length < 1 || langQualification.length < 1){
                return setError('Fill required field')
            }

            else{
                for(let i=0; i<langQualification.length; i++){
                    if(i+1 === langQualification.length){
                        stringLang += langQualification[i]
                    }
                    else{
                        stringLang += (langQualification[i] + ', ')
                    }
                }        
                await fetch('/jobs/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        company_name: companyName,
                        address: address,
                        phone_no: phoneNo,
                        email: companyEmail,
                        job_position: jobPosition,
                        type: type,
                        desc: desc,
                        lang_qualification: stringLang,
                        company_id: id
                    })
                })
            }
        }catch (err){
            setError('Unexpected error occured')
            console.log(err)
        }
        setLoading(false)
        window.location.reload()
    }

        const handleEditSkill = (skill) => {
            if(langQualification.includes(skill)){
                setLangQualification(langQualification => langQualification.filter(s => s !== skill)) 
            }
            else {
                setLangQualification([...langQualification, skill]) 
            }
        }

    return (
        <Grid container width='450px' height='600px' mx={1} px={5} py={3} borderRadius='10px' justifyContent="center" bgcolor='#D1D3D4'>
            <Grid item xs={12}>
                <Typography variant='body' fontSize='25px'>Post a Job</Typography>
                {error && <Alert severity='error'>{error}</Alert>}
                <TextField
                    margin="normal"
                    variant='filled'
                    required
                    fullWidth
                    label="Job Position"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Select variant='filled' defaultValue={type} fullWidth onChange={(e) => setType(e.target.value)} size='small'>
                    <MenuItem value="Full Time">Full-Time</MenuItem>
                    <MenuItem value="Part Time">Part-Time</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    margin="normal"
                    variant='filled'
                    required
                    multiline
                    rows={4}
                    fullWidth
                    label="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
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
            <Button variant='contained' onClick={handlePost} sx={{backgroundColor:'#008ED3'}}>Post Job</Button>
        </Grid>
    )
}

export default CompanyAddJob