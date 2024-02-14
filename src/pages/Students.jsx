import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/User'
import MUIDataTable from 'mui-datatables'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useNavigate } from 'react-router'

import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'


import { TableHeading } from '../components/tableHeading'

const StudentsPage = () => {
    const [userData, setUserData] = useState([])
    const [studentsData, setStudentsData] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState([])
    const { user } = useContext(UserContext)
    const Navigate = useNavigate()
    let [studentsgot, setStudentsgot] = useState(false);

    const [supervisorstudents, setsupervisorstudents] = useState([]);

    let get_supervisor_sudents = async () => {

        try {
            const response = await axios.get(`http://localhost:5000/get_supervisor_sudents/${user._id}`)
            // console.log(response.data);
            setStudentsData(response.data)
            setStudentsgot(true);
        } catch (error) {
            // console.error(`Error fetching student data for ID ${id}:`, error)
            return null // or handle the error in an appropriate way
        }
    }

    useEffect(() => {

        if (!studentsgot) {
            get_supervisor_sudents();
        }

        let isMounted = true

        // const fetchStudentDataById = async (id) => {
        //     try {
        //         const response = await axios.get(`http://localhost:5000/getUser/${id}`)
        //         return response.data
        //     } catch (error) {
        //         console.error(`Error fetching student data for ID ${id}:`, error)
        //         return null // or handle the error in an appropriate way
        //     }
        // }

        // const fetchAllStudentData = async () => {

        //     const studentsData = await Promise.all(supervisorstudents?.map((supervisionrequests) => fetchStudentDataById(supervisionrequests.student_id)))

        //     if (isMounted) {
        //         setStudentsData((prevData) => [...prevData, ...studentsData])
        //     }
        // }

        // fetchAllStudentData()

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
            console.log(result)
            setStudents(result)
            console.log(students)
        }
    }, [studentsData])

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
            label: 'Phone No',
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
        // {
        //     name: 'pdf_id',
        //     label: 'Visit',
        //     options: {
        //         sort: false,
        //         filter: false,
        //         customBodyRender: (value) => {
        //             const statusStyle = {
        //                 padding: '6px 4px',
        //                 width: '100px',
        //                 background: '#eeeeee',
        //                 color: '#333333',
        //                 borderRadius: '4px',
        //                 textAlign: 'center'
        //             }
        //             let isAvailable
        //             if (value) {
        //                 isAvailable = 'YES'
        //             } else {
        //                 isAvailable = 'NO'
        //             }
        //             if (isAvailable) {
        //                 return (
        //                     <Typography
        //                         className="details-text"
        //                         onClick={() => Navigate(`/proposals/VisitSingleProposal/${value}`)}
        //                         sx={{ cursor: 'pointer', fontFamily: 'Outfit', fontSize: '14px', ...statusStyle }}
        //                     >
        //                         VIEW
        //                     </Typography>
        //                 )
        //             }
        //         }
        //     }
        // }
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
            <div className="bg-neutral-100 overflow-hidden flex flex-row">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex-1 p-4 min-h-0 ">
                        <TableHeading name={'Students'} />
                        {loading ? (
                            <div> ADDLoader</div>
                        ) : (
                            <>
                                <MUIDataTable data={students} columns={columns} options={options} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentsPage
