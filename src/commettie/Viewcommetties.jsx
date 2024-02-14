import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router'
import MUIDataTable from 'mui-datatables'
import { Typography } from '@mui/material';
import { UserContext } from '../context/User';
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Swal from 'sweetalert2';


function Viewcommetties() {

    let [commetties, setcommetties] = useState([]);
    let [update, setupdate] = useState(false);
    const navigate = useNavigate();

    let get_all_commetties = async () => {
        const response = await axios.get("/get_all_commetties");
        setcommetties(response.data);
    }

    const getuserbyid = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/get_user_by_id/${id}/teacher`);
            // console.log("teacher id : "+response.data[0]._id);
            return response.data[0]
        } catch (error) {
            console.error(`Error fetching `, error)
            return null // or handle the error in an appropriate way
        }
    }

    let get_studets_with_commetti_id = async (id) => {

        const response = await axios.post('/get_studets_with_commetti_id', {
            '_id': id
        });
        return response.data;

    }

    let upadateData = async () => {

        const _data = await Promise.all(commetties?.map(async (comm, index) => {
            let students = await get_studets_with_commetti_id(comm._id);
            comm['students'] = students;
            return comm;

        }));

        const new_data = await Promise.all(_data?.map(async (comm, index) => {
            let teachers = await Promise.all(comm.commetti_members.map(async (item) => {
                let teacher = await getuserbyid(item);
                if (item == comm.commetti_head) {
                    comm['commetti_head_name'] = teacher.name;
                }
                return teacher;
            }));

            comm['members_name'] = teachers;
            return comm;
        }));

        // console.log(new_data);
        setcommetties(new_data);
        setupdate(true);
    }

    useEffect(() => {
        if (commetties.length > 0 && !update) {
            upadateData();
        }
        else if (!update) {
            get_all_commetties();
        }
    }, [commetties]);

    let deletecommetti = async (id) => {

        const response = await axios.post("/delete_commetti", {
            '_id': id
        });

        if (response.data.result == 'deleted') {
            get_all_commetties();
        } else {
            Swal.fire("Cann't delete commetti! Assigned to students")
        }

    }

    const columns = [
        {
            name: 'commetti_title',
            label: 'Title',
            options: {
                sort: false,
                filter: false
            }
        },
        {
            name: 'commetti_department',
            label: 'Department',
        },
        {
            name: 'commetti_members',
            label: 'Members count',
            options: {
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const statusStyle = {
                        padding: '6px 4px',
                        width: '100px',
                        background: '#eeeeee',
                        color: '#333333',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }
                    let isAvailable
                    if (value) {
                        isAvailable = 'YES'
                    } else {
                        isAvailable = 'NO'
                    }
                    if (isAvailable) {

                        return (
                            <Typography
                                className="details-text"
                                sx={{}}
                            >
                                {value?.length}
                            </Typography>
                        )


                    }
                }
            }
        },
        {
            name: 'members_name',
            label: 'Members',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    const statusStyle = {
                        padding: '6px 4px',
                        width: '100px',
                        background: '#eeeeee',
                        color: '#333333',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }
                    let isAvailable
                    if (value) {
                        isAvailable = 'YES'
                    } else {
                        isAvailable = 'NO'
                    }
                    if (isAvailable) {
                        return (
                            <>
                                {
                                    value?.length > 0 &&
                                    <>
                                        {
                                            value.map((item) => {
                                                return <Typography
                                                    className="details-text"
                                                    sx={{}}
                                                >
                                                    {item.name}
                                                </Typography>
                                            })
                                        }
                                    </>
                                }
                            </>
                        )
                    }
                }
            }
        },
        {
            name: 'commetti_head_name',
            label: 'Commetti Head',
        },
        {
            name: 'students',
            label: 'Students',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    const statusStyle = {
                        padding: '6px 4px',
                        width: '100px',
                        background: '#eeeeee',
                        color: '#333333',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }
                    let isAvailable
                    if (value) {
                        isAvailable = 'YES'
                    } else {
                        isAvailable = 'NO'
                    }
                    if (isAvailable) {
                        return (
                            <>
                                {value?.length > 0 &&
                                    <>
                                        {
                                            value.map((item) => {
                                                return <Typography
                                                    className="details-text"
                                                    sx={{}}
                                                >
                                                    {item.name}
                                                </Typography>
                                            })
                                        }
                                    </>
                                }
                                {value?.length == 0 &&
                                    <>
                                        <Typography
                                            className="details-text"
                                            sx={{}}
                                        >
                                            {'No Students'}
                                        </Typography>
                                    </>

                                }
                            </>
                        )
                    }
                }
            }
        },
        {
            name: '_id',
            label: 'Action',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    const statusStyle = {
                        padding: '6px 4px',
                        width: '100px',
                        background: '#eeeeee',
                        color: '#333333',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }
                    let isAvailable
                    if (value) {
                        isAvailable = 'YES'
                    } else {
                        isAvailable = 'NO'
                    }
                    if (isAvailable) {
                        return (
                            <a
                                className="details-text"
                                style={{ cursor: 'pointer' }}
                                onClick={() => { deletecommetti(value) }}
                            >
                                Delete
                            </a>

                        )
                    }
                }
            }
        }
    ]

    const HeaderElements = () => {
        // return (
        //     <Button type="button" onClick={() => console.log('Clicked')}>
        //         + Add Booking
        //     </Button>
        // );
    }

    const options = {
        customHeadRender: () => ({
            style: {
                fontFamily: 'Outfit',
                fontSize: '48px',
                fontWeight: 500,
                lineHeight: '24px',
                letterSpacing: '0',
                textAlign: 'center'
            }
        }),
        responsive: 'standard',
        print: false,
        download: false,
        viewColumns: false,
        tableLayout: 'fixed',
        customTableBodyWidth: 'auto',
        tableBodyHeight: 'auto',
        selectableRowsHideCheckboxes: true,
        customToolbar: HeaderElements
    }

    return (
        <>
            <div className='' style={{ width: "auto" }}>
                <Button variant="contained" color="primary" onClick={() => { navigate('Addcommetti') }} style={{ marginTop: '10px' }}>
                    Add new Commetti
                </Button>
                <div>
                    <div className='mt-5'>
                        <MUIDataTable data={commetties} columns={columns} options={options} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Viewcommetties