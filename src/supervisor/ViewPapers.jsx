import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/User'
import MUIDataTable from 'mui-datatables'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'
import { TableHeading } from '../components/tableHeading'

function ViewPapers() {

    let { user } = useContext(UserContext);
    let [papers, setpapers] = useState([]);
    let [papersgot, setpapersgot] = useState(false);
    let [updated, setupdated] = useState(false);

    let navigate = useNavigate();

    let get_all_papers = async () => {

        let response = await axios.post('/get_all_papers', {
            'user_type': 'teacher',
            '_id': user?._id
        });
        console.log(response.data);
        setpapers(response.data);
        setpapersgot(true);
    }

    const fetchStudentDataById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/getUser/${id}`)
            return response.data
            // console.log(response.data)
        } catch (error) {
            console.error(`Error fetching student data for ID ${id}:`, error)
            return null // or handle the error in an appropriate way
        }
    }

    let updateData = async () => {

        const _data = await Promise.all(papers?.map(async (paper) => {
            let student = await fetchStudentDataById(paper.student_id)
            paper["student_name"] = student?.name;
            // console.log(student);
            return student;
        }));

        // setpapers(_data);
        setupdated(true);
    }

    useEffect(() => {

        if (!papersgot) {
            get_all_papers();

        }
        else if (papersgot && !updated) {
            updateData();
        }
    }, [papers]);

    const columns = [
        {
            name: 'pdfName',
            label: 'Name',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {

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
                            >
                                {value?.substring(13)}
                            </Typography>
                        )
                    }
                }
            }
        },
        {
            name: 'student_name',
            label: 'Student',
            options: {
                sort: false
            }
        },
        {
            name: '_id',
            label: 'Visit',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {
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
                                onClick={() => navigate(`/proposals/VisitSingleProposal/${value}`)}
                                sx={{ cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px', ...statusStyle }}
                            >
                                VIEW
                            </Typography>
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
                        if (tableMeta.rowData[1] != 'pending') {
                            return (
                                <Typography
                                    className="details-text"
                                    onClick={() => {
                                        if (user?.role == 'CoordinateCommitte') {
                                            navigate(`/SeeCommentsOnDoc/${value}/CoordinateCommitte`)
                                        }
                                        else if (user?.role == 'DAC') {
                                            navigate(`/SeeCommentsOnDoc/${value}/DAC`)
                                        }
                                        else if (user?.role == 'Supervisor') {
                                            navigate(`/SeeCommentsOnDoc/${value}/supervisor`)
                                        }
                                    }}
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
        <>
            <div className=" flex flex-row">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
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
        </>
    )
}

export default ViewPapers