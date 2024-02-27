// material-ui
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import { Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router'
import MUIDataTable from 'mui-datatables'
import axios from 'axios';
import { Typography } from '@mui/material';
import { UserContext } from '../context/User';
import { toast } from 'react-toastify';
import { TableHeading } from '../components/tableHeading'


const MyProposal = () => {

    let { user } = useContext(UserContext);

    const navigate = useNavigate();

    let [proposals, setproposals] = useState([]);
    let [proposals_data, setproposals_data] = useState([]);

    let get_proposals = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/students/get_proposals/${user._id}`);
            setproposals(response.data);
        }
        catch (err) {

        }
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

    const updatedata = async () => {
        const _data = await Promise.all(proposals?.map(async (proposal, index) => {
            let teacher = await getuserbyid(proposal.teacher_id);
            proposal['teacher_name'] = teacher.name;
            proposal['teacher_id'] = teacher._id;
            proposal['info'] = {
                'status': proposal.status,
                'forwarded_by': proposal.forwarded_by
            }
            return proposal;
        }));
        // console.log(_data);
        setproposals_data(_data);
    }

    useEffect(() => {
        if (proposals.length > 0) {
            updatedata();
        }
        else if (proposals_data.length == 0) {
            get_proposals();
        }

    }, [proposals]);


    let deletepdf = async (id) => {
        let response = await axios.post('http://localhost:5000/api/delete_pdf', {
            '_id': id,
        });
        if (response.status == 200) {
            toast.success('Deleted');
            get_proposals();
        }
        else {
            toast.error('Error deleting');
        }
    }

    const columns = [
        {
            name: 'teacher_name',
            label: 'Teacher',
            options: {
                sort: false,
                filter: false
            }
        },
        {
            name: 'document_name',
            label: 'PDF',
            options: {
                sort: false,
                filter: false
            }
        },
        {
            name: 'info',
            label: 'Status',
            options: {
                sort: false,
                customBodyRender: (value) => {


                    if (value?.status == 'approved') {
                        return (
                            <>
                                {
                                    value?.forwarded_by != null &&
                                    <p style={{ fontSize: '12px', fontStyle: 'italic', color: "green" }}>forwarded by : {value.forwarded_by}</p>

                                }
                                <p style={{ color: 'green' }}>{value?.status}</p>
                            </>
                        )
                    } else if (value?.status == 'rejected') {
                        return (
                            <>
                                {
                                    value?.forwarded_by != null &&
                                    <p style={{ fontSize: '12px', fontStyle: 'italic', color: "green" }}>forwarded by : {value.forwarded_by}</p>

                                }
                                <p style={{ color: 'red' }}>{value?.status}</p>
                            </>
                        )
                    } else if (value?.status == 'modify') {
                        return (
                            <>{
                                value?.forwarded_by != null &&
                                <p style={{ fontSize: '12px', fontStyle: 'italic', color: "green" }}>forwarded by : {value.forwarded_by}</p>

                            }
                                <p style={{ color: 'orange' }}>{value?.status}</p>
                            </>
                        )
                    }
                    else if (value?.status == 'modified') {
                        return (
                            <>{
                                value?.forwarded_by != null &&
                                <p style={{ fontSize: '12px', fontStyle: 'italic', color: "green" }}>forwarded by : {value.forwarded_by}</p>

                            }
                                <p style={{ color: 'orange' }}>{value?.status}</p>
                            </>
                        )
                    }
                    else {
                        return (
                            <>{
                                value?.forwarded_by != null &&
                                <p style={{ fontSize: '12px', fontStyle: 'italic', color: "green" }}>forwarded by : {value.forwarded_by}</p>

                            }
                                <p style={{ color: 'gray', fontStyle: 'italic' }}>{'Pending'}</p>
                            </>
                        )
                    }
                }
            }
        },
        {
            name: 'reason',
            label: 'Feedback',
            options: {
                sort: false
            }
        },
        {
            name: '_id',
            label: 'View',
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
                        if (tableMeta.rowData[1] != 'pending') {
                            return (
                                <Typography
                                    className="details-text"
                                    onClick={() => { navigate(`/supervisionRequestResult/${value}/${tableMeta.rowData[1]}`) }}
                                    sx={{ cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px', ...statusStyle }}
                                >
                                    View
                                </Typography>
                            )
                        }

                    }
                }
            }
        }
        ,
        {
            name: '_id',
            label: 'Delete',
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
                        if (tableMeta.rowData[1] != 'pending') {
                            return (
                                <Typography
                                    className="details-text"
                                    onClick={() => { deletepdf(value) }}
                                    sx={{ cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px', ...statusStyle }}
                                >
                                    Delete
                                </Typography>
                            )
                        }

                    }
                }
            }
        }
        ,
        {
            name: '_id',
            label: 'Comments',
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
                        if (tableMeta.rowData[1] != 'pending') {
                            return (
                                <Typography
                                    className="details-text"
                                    onClick={() => { navigate(`/SeeCommentsOnDoc/${value}/student`) }}
                                    sx={{ cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px', ...statusStyle }}
                                >
                                    See Comments
                                </Typography>
                            )
                        }

                    }
                }
            }
        }
    ]
    const HeaderElements = () => {
        // return (
        //   // <Button type="button" onClick={() => console.log('Clicked')}>
        //   //   + Add Booking
        //   // </Button>
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
        <div className="bg-neutral-100  overflow-hidden flex flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-4 min-h-0 overflow-auto">
                    <div>
                        <Button variant="contained" color="primary" onClick={() => { navigate('/sendproposal') }} style={{ marginTop: '10px' }}>
                            Submit New Proposal
                        </Button>
                    </div>
                    <div className="flex-1 p-4  overflow-auto">

                        {
                            proposals_data.filter((item) => item.status == 'Pending').length > 0 &&
                            <>
                                <TableHeading name={'Pending '} />
                                <MUIDataTable data={proposals_data.filter((item) => item.status == 'Pending')} columns={columns} options={options} />
                            </>
                        }

                        {
                            proposals_data.filter((item) => item.status == 'modify').length > 0 &&
                            <>
                                <TableHeading name={'To modify '} />
                                <MUIDataTable data={proposals_data.filter((item) => item.status == 'modify')} columns={columns} options={options} />

                            </>
                        }
                        {
                            proposals_data.filter((item) => item.status == 'modified').length > 0 &&
                            <>
                                <TableHeading name={'Modified '} />
                                <MUIDataTable data={proposals_data.filter((item) => item.status == 'modified')} columns={columns} options={options} />

                            </>
                        }

                        {
                            proposals_data.filter((item) => item.status == 'rejected').length > 0 &&
                            <>
                                <TableHeading name={'Rejected '} />
                                <MUIDataTable data={proposals_data.filter((item) => item.status == 'rejected')} columns={columns} options={options} />

                            </>
                        }
                        {
                            proposals_data.filter((item) => item.status == 'approved').length > 0 &&
                            <>
                                <TableHeading name={'Accepted '} />
                                <MUIDataTable data={proposals_data.filter((item) => item.status == 'approved')} columns={columns} options={options} />

                            </>
                        }


                    </div>


                </div>

            </div>
        </div>
    )
}

export default MyProposal
