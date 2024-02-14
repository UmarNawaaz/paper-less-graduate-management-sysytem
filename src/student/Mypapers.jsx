import React, { useContext, useEffect, useState } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { UserContext } from '../context/User'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { uploadStudentPDF } from '../apis/UploadStudentPdf'
import { selectTeacherForStudent } from '../apis/SelectSuperVisor'
import FeedbackModal from '../components/Modal'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'
import { Box, Card, CardContent, Divider, Grid, List, ListItem, Avatar, Typography, Button } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import { TableHeading } from '../components/tableHeading'


function Mypapers() {

    let { user } = useContext(UserContext);
    let navigate = useNavigate();

    let [papers, setpapers] = useState([]);
    let [updated, setupdated] = useState(false);

    let get_all_papers = async () => {
        let response = await axios.post('/get_all_papers', {
            'user_type': 'student',
            '_id': user?._id
        });
        // console.log(response.data);
        setpapers(response.data);
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
        const _data = await Promise.all(papers?.map(async (paper, index) => {
            let teacher = await getuserbyid(paper.teacher_id);
            paper['teacher_name'] = teacher.name + " (" + teacher.role + ")";
            return paper;
        }));
        setpapers(_data);
    }

    useEffect(() => {
        if (!updated && papers.length == 0) {
            get_all_papers();
        }
        else if (!updated && papers.length > 0) {
            updatedata();
        }
    }, [papers]);

    const columns = [
        {
            name: 'pdfName',
            label: 'Document',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    let isAvailable
                    if (value) {
                        isAvailable = 'YES'
                    } else {
                        isAvailable = 'NO'
                    }
                    if (isAvailable) {
                        return (
                            <p
                                className="details-text"
                            >
                                {value?.substring(13)}
                            </p>
                        )

                    }
                }
            }
        },
        // {
        //     name: 'status',
        //     label: 'Status',
        //     options: {
        //         sort: false,
        //         customBodyRender: (value) => {
        //             if (value == 'approved') {
        //                 return (
        //                     <p style={{ color: 'green' }}>{value}</p>
        //                 )
        //             } else if (value == 'rejected') {
        //                 return (
        //                     <p style={{ color: 'red' }}>{value}</p>
        //                 )
        //             } else if (value == 'modify') {
        //                 return (
        //                     <p style={{ color: 'orange' }}>{value}</p>
        //                 )
        //             }
        //             else {
        //                 return (
        //                     <p style={{ color: 'gray', fontStyle: 'italic' }}>{'Pending'}</p>
        //                 )
        //             }
        //         }
        //     }
        // },
        {
            name: 'teacher_name',
            label: 'Teacher',
            options: {
                sort: false
            }
        },
        {
            name: 'pdf_type',
            label: 'Document',
            options: {
                sort: false
            }
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                sort: false
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
                        if (tableMeta.rowData[1] != 'pending') {
                            return (
                                <Typography
                                    className="details-text"
                                    onClick={() => { navigate(`/ViewPaperResult/${value}/${tableMeta.rowData[3]}`) }}
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
                    <Button onClick={() => { navigate('/uploadpaper') }}>
                        Upload New
                    </Button>
                    <div className="flex-1 p-4 min-h-0 overflow-auto">
                        {
                            papers.filter((item) => item.status == 'Pending').length > 0 &&
                            <>
                                <TableHeading name={'Pending '} />
                                <MUIDataTable data={papers.filter((item) => item.status == 'Pending')} columns={columns} options={options} />


                            </>
                        }
                        {
                            papers.filter((item) => item.status == 'modify').length > 0 &&
                            <>
                                <TableHeading name={'To modify '} />
                                <MUIDataTable data={papers.filter((item) => item.status == 'modify')} columns={columns} options={options} />


                            </>
                        }
                        {
                            papers.filter((item) => item.status == 'modified').length > 0 &&
                            <>
                                <TableHeading name={'Modified '} />
                                <MUIDataTable data={papers.filter((item) => item.status == 'modified')} columns={columns} options={options} />


                            </>
                        }
                        {
                            papers.filter((item) => item.status == 'rejected').length > 0 &&
                            <>
                                <TableHeading name={'Rejected '} />
                                <MUIDataTable data={papers.filter((item) => item.status == 'rejected')} columns={columns} options={options} />


                            </>
                        }
                        {
                            papers.filter((item) => item.status == 'approved').length > 0 &&
                            <>
                                <TableHeading name={'Accepted '} />
                                <MUIDataTable data={papers.filter((item) => item.status == 'approved')} columns={columns} options={options} />


                            </>
                        }




                    </div>

                </div>
            </div>
        </div>
    )
}

export default Mypapers