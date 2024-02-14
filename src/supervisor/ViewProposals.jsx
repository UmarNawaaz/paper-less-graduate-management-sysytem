import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/User'
import MUIDataTable from 'mui-datatables'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'
import { TableHeading } from '../components/tableHeading'

const ViewProposals = () => {

    const [userData, setUserData] = useState([])
    const [studentsData, setStudentsData] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState([])
    const { user } = useContext(UserContext);
    let [studentsgot, setStudentsgot] = useState(false);
    const [supervisorstudents, setsupervisorstudents] = useState([]);
    const Navigate = useNavigate()

    let [acceptedstudents, setacceptedstudents] = useState([])
    let [rejectedstudents, setrejectedstudents] = useState([]);
    let [pendingstudents, setpendingstudents] = useState([]);
    let [tomodifystudents, settomodifytudents] = useState([]);
    let [modifiedstudents, setmodifiedstudents] = useState([]);


    let get_sudents_with_proposals = async () => {

        try {
            const response = await axios.get(`http://localhost:5000/get_sudents_with_proposals/${user._id}`)
            setsupervisorstudents(response.data)
            // console.log(response.data);
            setStudentsgot(true);
        } catch (error) {
            // console.error(`Error fetching student data for ID ${id}:`, error)
            return null // or handle the error in an appropriate way
        }
    }
    useEffect(() => {
        if (!studentsgot) {
            get_sudents_with_proposals();
        }

        let isMounted = true
        const fetchStudentDataById = async (id) => {
            try {
                const response = await axios.get(`http://localhost:5000/getUser/${id}`)
                return response.data
            } catch (error) {
                console.error(`Error fetching student data for ID ${id}:`, error)
                return null // or handle the error in an appropriate way
            }
        }
        const fetchAllStudentData = async () => {

            const studentsData = await Promise.all(supervisorstudents?.map(async (supervisionrequests) => {
                let student = await fetchStudentDataById(supervisionrequests.student_id)
                student["supervision_status"] = supervisionrequests.status;
                student['pdf_id'] = supervisionrequests._id;
                // console.log(student);
                return student;

            }))
            if (isMounted) {
                setStudentsData((prevData) => [...prevData, ...studentsData])
            }

        }
        fetchAllStudentData()
        return () => {
            isMounted = false
        }

    }, [supervisorstudents])

    useEffect(() => {
        const removeDuplicates = (objectsArray) => {
            const seen = new Set()
            return objectsArray?.filter((obj) => {
                const objString = JSON.stringify(obj)
                if (!seen.has(objString)) {
                    seen.add(objString)
                    return true
                }
                return false
            })
        }
        if (studentsData) {
            const result = removeDuplicates(studentsData)
            setStudents(result)
            // console.log(result);

            let a = [];
            let tm = [];
            let r = [];
            let mod = []
            let p = []

            result.map((stu) => {
                if (stu.supervision_status == 'approved') {
                    a.push(stu)
                }
                else if (stu.supervision_status == 'modify') {
                    tm.push(stu);
                }
                else if (stu.supervision_status == 'rejected') {
                    r.push(stu);
                }
                else if (stu.supervision_status == 'modified') {
                    mod.push(stu);
                }
                else if (stu.supervision_status == 'Pending') {
                    p.push(stu);
                }
            });

            settomodifytudents(tm);
            setacceptedstudents(a);
            setmodifiedstudents(mod);
            setpendingstudents(p);
            setrejectedstudents(r);
            setduplicatedremoved(true);
        }

    }, [studentsData])

    let [duplicateremoved, setduplicatedremoved] = useState(false)

    useEffect(() => {

    }, [duplicateremoved])

    const columns = [
        {
            name: 'name',
            label: 'Name',
            options: {
                sort: false,
                filter: false
            }
        },

        {
            name: 'phone',
            label: 'Phone',
            options: {
                sort: false
            }
        },
        {
            name: 'email',
            label: 'Email',
            options: {
                sort: false
            }
        },

        {
            name: 'department',
            label: 'Department',
            options: {
                sort: false
            }
        },
        {
            name: 'pdf_id',
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
                                onClick={() => Navigate(`/proposals/VisitSingleProposal/${value}`)}
                                sx={{ cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px', ...statusStyle }}
                            >
                                VIEW
                            </Typography>
                        )
                    }
                }
            }
        }
        ,
        {
            name: 'pdf_id',
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
                                    onClick={() => { Navigate(`/SeeCommentsOnDoc/${value}/supervisor`) }}
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
            <div className="bg-neutral-100  overflow-hidden flex flex-row">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex-1 p-4 min-h-0 overflow-auto">

                        {pendingstudents.length > 0 &&
                            <>
                                <TableHeading name={'Pending Proposals'} />
                                <MUIDataTable data={pendingstudents} columns={columns} options={options} />
                            </>
                        }

                        {tomodifystudents.length > 0 &&
                            <>
                                <TableHeading name={'To Modify Proposals'} />
                                <MUIDataTable data={tomodifystudents} columns={columns} options={options} />
                            </>
                        }
                        {modifiedstudents.length > 0 &&
                            <>
                                <TableHeading name={'Modified Proposals'} />
                                <MUIDataTable data={modifiedstudents} columns={columns} options={options} />
                            </>
                        }
                        {rejectedstudents.length > 0 &&
                            <>
                                <TableHeading name={'Rejected Proposals'} />
                                <MUIDataTable data={rejectedstudents} columns={columns} options={options} />
                            </>
                        }

                        {acceptedstudents.length > 0 &&
                            <>
                                <TableHeading name={'Accepted Proposals'} />
                                <MUIDataTable data={acceptedstudents} columns={columns} options={options} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewProposals
