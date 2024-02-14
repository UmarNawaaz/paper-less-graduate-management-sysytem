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
import Button from '@mui/material/Button'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'
import { Box, Card, CardContent, Divider, Grid, List, ListItem, Avatar, Typography } from '@mui/material'


function SeeCommentsOnDoc() {

    let { pdf_id, role } = useParams();

    let [comment, setcomment] = useState(null);
    let [updated, setupdated] = useState(false);
    let [pdfdata, setpdfdata] = useState(null);

    const getuserbyid = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/get_user_by_id/${id}/teacher`);
            return response.data[0];
        } catch (error) {
            console.error(`Error fetching `, error)
            return null
        }
    }

    let get_data = async () => {
        let response = await axios.post('http://localhost:5000/get_comments_on_pdf', {
            '_id': pdf_id
        })
        setcomment(response.data)
    }

    const updatedata = async () => {
        if (role == "student" || role == 'supervisor') {
            const _data = await Promise.all(comment?.map(async (com, index) => {
                let teacher = await getuserbyid(com.teacher_id);
                com['teacher_name'] = teacher.name
                com['teacher_role'] = teacher.role
                return com;
            }));
            setcomment(_data);
            setupdated(true);

        }
        else {
            const _data = await Promise.all(comment?.map(async (com, index) => {
                let teacher = await getuserbyid(com.teacher_id);
                if (teacher.role == role) {
                    com['teacher_name'] = teacher.name
                    com['teacher_role'] = teacher.role
                    return com;
                }
            }));
            setcomment(_data);
            setupdated(true);
        }

    }
    const fetchPdfContent = async (pdf_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/pdf/${pdf_id}`);
            setpdfdata(response.data)
        } catch (error) {
            console.error('Error fetching PDF:', error)
        }
    }

    useEffect(() => {
        if (comment == null) {
            get_data();
            fetchPdfContent(pdf_id);

        }
        else if (comment != null && !updated) {
            updatedata();
        }
    }, [comment])

    return (
        <>
            <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />

                    <div className="flex-1 p-4 min-h-0 overflow-auto">

                        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                            {'DOCUMENT'} : {pdfdata?.pdfName.substring(13)}
                        </Typography>
                        <div className='flex-1 ' style={{}}>
                            {
                                comment?.length > 0 &&
                                <>
                                    {comment.map((item) => {
                                        return <>
                                            <Grid
                                                sx={{ display: 'flex', justifyContent: 'start', marginTop: 1 }}
                                            >

                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        // maxWidth: '300px',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                                            <Avatar alt="User" src={item?.teacher_name} />
                                                            <Typography
                                                                variant="body1"
                                                                sx={{ fontWeight: 'bold', marginLeft: '10px' }}
                                                            >
                                                                {item?.teacher_name} ({item?.teacher_role})
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                                            {item?.text}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>

                                            </Grid>
                                        </>
                                    })}
                                </>
                            }</div>
                        {
                            comment?.length == 0 &&
                            <>
                                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                    {'No Comments'}
                                </Typography>
                            </>

                        }
                    </div>
                </div>
            </div>
        </>
    )


}

export default SeeCommentsOnDoc