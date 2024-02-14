import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Input } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router'
import MUIDataTable from 'mui-datatables'
import { Typography } from '@mui/material';
import { UserContext } from '../context/User';
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import CommettiTeacherCard from '../commettie/CommettiTeacherCard';

function Adddac() {

    let navigate = useNavigate();

    let [teachers, setteachers] = useState([]);
    let [selectedteachers, setseletedteachers] = useState([]);
    let [title, settitle] = useState('');
    let [dep, setdep] = useState(null);
    let [dachead, setdachead] = useState(null);

    let departments = [
        'CS',
        'SE'
    ]

    let createcommetti = async () => {
        if (title != '') {
            const response = await axios.post('/add_new_dac', {
                'teachers': selectedteachers,
                'title': title,
                'department': dep,
                'dac_head': dachead
            })
            // console.log(response.data)
            navigate('/admin/admin/Viewdac');
        }
        else {
            alert('Enter title')
        }
    }

    let handledepartmentchange = async (e) => {
        setdep(e.target.value)
        let response = await axios.get(`/get_dac/${e.target.value}`)
        // console.log(response.data);
        setteachers(response.data);
    }


    return (
        <div style={{ width: '600px', margin: 10 }}>
            <FormControl
                style={{
                    margin: 'auto',
                    width: '50%',
                }}
            >
                <InputLabel id="supervisor-label">Select Department</InputLabel>
                <Select
                    labelId="supervisor-label"
                    id="supervisor-select"
                    label="Select Supervisor"
                    onChange={handledepartmentchange}
                >

                    {departments.map((dep, index) => (
                        <MenuItem key={index} value={dep}>
                            {dep}
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: 5 }}>
                {
                    teachers?.map((teacher) => {
                        return <CommettiTeacherCard teacher={teacher} teachers={selectedteachers} setteachers={setseletedteachers} />
                    })
                }
            </div>
            {

                selectedteachers.length > 0 &&
                <>
                    <div>
                        <InputLabel id="title-label">Name DAC</InputLabel>
                        <Input labelId="title-label" type='text' value={title} onChange={(e) => settitle(e.target.value)} />
                    </div>

                    <div>

                        <FormControl
                            style={{
                                marginTop: '15px',
                                width: '50%',
                            }}
                        >
                            <InputLabel id="supervisor-label">Select DAC head</InputLabel>
                            <Select
                                labelId="supervisor-label"
                                id="supervisor-select"
                                label="Select Supervisor"
                                onChange={(e) => setdachead(e.target.value)}
                            >

                                {selectedteachers.map((dep, index) => (
                                    <MenuItem key={index} value={dep.teacher_id}>
                                        {dep.teacher_name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <div>
                            <Button variant="contained" color="primary" onClick={() => { createcommetti() }} style={{ marginTop: '15px' }}>
                                Create
                            </Button>
                        </div>
                    </div>
                </>

            }

        </div>
    )
}

export default Adddac