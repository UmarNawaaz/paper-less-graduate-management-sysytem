import React, { useState, useEffect, useContext } from 'react' // ,{ useState }
import MUIDataTable from 'mui-datatables'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router'
import { UserContext } from '../context/User'
import { TableHeading } from '../components/tableHeading'
import { toast } from 'react-toastify'
import axios from 'axios'

import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'


const CommentsPage = () => {
    const { user, setUser } = useContext(UserContext)
    const [comments, setComments] = useState([])
    const [userData, setUserData] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)


    const get_comments = async () => {
        try {
            setLoading(true) // Set loading to true before the API call

            const response = await axios.get(`http://localhost:5000/students/get_comments`)
            // console.log(response.data)
            setComments(response.data)

        } catch (error) {
            console.error('Error fetching PDF:', error)
            toast.error('Failed to fetch PDF content')
        } finally {
            setLoading(false) // Set loading to false regardless of the API call result
        }
    }

    const getuserbyid = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/get_user_by_id/${id}/teacher`);
            // console.log(response.data[0]._id);
            return response.data[0]
        } catch (error) {
            console.error(`Error fetching `, error)
            return null // or handle the error in an appropriate way
        }
    }

    const get_pdf_data_id = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/get_pdf_by_id/${id}`);
            // console.log(response.data);
            return response.data
        } catch (error) {
            console.error(`Error fetching `, error)
            return null // or handle the error in an appropriate way
        }
    }

    let [updated, setupdated] = useState(false);

    const updatedata = async () => {
        let _data = await Promise.all(comments?.map(async (comment, index) => {
            let teacher = await getuserbyid(comment.teacher_id);
            comment['teacher_name'] = teacher.name;
            comment['teacher_type'] = teacher.role;
            return comment;
        }));

        const new_data = await Promise.all(_data?.map(async (comment, index) => {
            let pdf = await get_pdf_data_id(comment.pdf_id);
            comment['document_name'] = pdf.pdfName;
            return comment;
        }));

        // console.log(new_data);
        setComments(new_data);
        setupdated(true);
    }

    useEffect(() => {
        if (comments.length > 0 && !updated) {
            updatedata();
        } else if (!updated) {
            get_comments();
        }
    }, [comments])

    const columns = [
        {
            name: 'teacher_name',
            label: 'Teacher',
            options: {
                sort: false,
                customBodyRender: (value) => {
                    const truncatedValue = value?.substring(0, 10)
                    return truncatedValue
                }
            }
        },
        {
            name: 'teacher_type',
            label: 'Role',
            options: {
                sort: false,
                customBodyRender: (value) => {
                    const truncatedValue = value?.substring(0, 10)
                    return truncatedValue
                }
            }
        },
        {
            name: 'document_name',
            label: 'Document',
            options: {
                sort: false,
                customBodyRender: (value) => {
                    const truncatedValue = value?.substring(13)
                    return truncatedValue?.length < value?.length ? truncatedValue + '...' : truncatedValue
                }
            }
        },
        {
            name: 'text',
            label: 'Comment',
            options: {
                sort: false,
                customBodyRender: (value) => {
                    const truncatedValue = value.substring(0, 50)
                    return truncatedValue.length < value.length ? truncatedValue + '...' : truncatedValue
                }
            }
        },

    ]

    const HeaderElements = () => { }

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

                        {loading ? (
                            // <div>i am loading</div>
                            <div>Add Loader</div>
                        ) : (
                            <>
                                {comments.length > 0 ? (
                                    <>

                                        {
                                            comments.filter((item) => item.teacher_type == 'Supervisor').length > 0 &&
                                            <>
                                                <TableHeading name={'Supervisor Comments'} />
                                                <MUIDataTable
                                                    // title={'Users list'}
                                                    data={comments.filter((item) => item.teacher_type == 'Supervisor')}
                                                    columns={columns}
                                                    options={options}
                                                />
                                            </>
                                        }
                                        {
                                            comments.filter((item) => item.teacher_type == 'CoordinateCommitte').length > 0 &&
                                            <>
                                                <TableHeading name={'Commetti Comments'} />
                                                <MUIDataTable
                                                    // title={'Users list'}
                                                    data={comments.filter((item) => item.teacher_type == 'CoordinateCommitte')}
                                                    columns={columns}
                                                    options={options}
                                                />
                                            </>
                                        }
                                        {
                                            comments.filter((item) => item.teacher_type == 'DAC').length > 0 &&
                                            <>
                                                <TableHeading name={'DAC Comments'} />
                                                <MUIDataTable
                                                    // title={'Users list'}
                                                    data={comments.filter((item) => item.teacher_type == 'DAC')}
                                                    columns={columns}
                                                    options={options}
                                                />
                                            </>
                                        }

                                    </>

                                ) : (
                                    <MUIDataTable
                                        // title={'Users list'}
                                        data={[]}
                                        columns={columns}
                                        options={options}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

export default CommentsPage
