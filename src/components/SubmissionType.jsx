import React, { useState, useContext, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Typography } from '@mui/material'
import { UserContext } from '../context/User'
import axios from 'axios'

export default function SubmissionTypePicker({ onSelectSubmissionType, onSuperViosrSelect }) {
    const { user } = useContext(UserContext)
    const [selectedSupervisor, setSelectedSupervisor] = useState('')
    const [teachers, setTeachers] = useState([])

    useEffect(() => {
        // Fetch teacher data when the component mounts 
        axios
            .get('http://localhost:5000/getTeacherData')
            .then((response) => {
                // console.log(response.data)
                const filteredTeachers = response.data.filter((teacher) => teacher.department === user.department && teacher.role == "Supervisor")
                // console.log(filteredTeachers);
                setTeachers(filteredTeachers)
            })
            .catch((error) => {
                console.error('Error fetching teacher data:', error)
            })
    }, [user])

    const handleSuperVisorChange = (event) => {
        setSelectedSupervisor(event.target.value)
        onSuperViosrSelect(event.target.value)

    }

    return (
        <>

            <Typography
                variant="h5"
                sx={{
                    width: '40%',
                    margin: 'auto',
                    margin: '40px 60px 20px',
                    fontWeight: 'bold'
                }}
            >
                Select SuperVisor
            </Typography>
            <FormControl
                style={{
                    margin: 'auto',
                    width: '40%',
                    margin: '20px 60px 0px'
                }}
            >
                <InputLabel id="supervisor-label">Select Supervisor</InputLabel>
                <Select
                    labelId="supervisor-label"
                    id="supervisor-select"
                    label="Select Supervisor"
                    value={selectedSupervisor}
                    onChange={handleSuperVisorChange}
                >
                    {teachers.map((teacher) => (
                        <MenuItem key={teacher._id} value={teacher._id}>
                            {teacher.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

        </>
    )
}
