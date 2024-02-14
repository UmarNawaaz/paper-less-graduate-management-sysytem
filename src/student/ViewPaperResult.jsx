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
import ViewCommentedPdf from './ViewCommentedPdf'


function ViewPaperResult() {

    let { pdf_id, status } = useParams();
    let { user } = useContext(UserContext);
    let [supervisor, setsupervisor] = useState();
    let [pdf, setpdf] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        if (pdf == null) {
            get_pdf_by_id();
        } else {
            getuserbyid(pdf.teacher_id);
        }
    }, [pdf])

    let get_pdf_by_id = async () => {

        let response = await axios.post('http://localhost:5000/api/get_pdf_by_id', {
            '_id': pdf_id
        })

        setpdf(response.data)
    }

    const getuserbyid = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/get_user_by_id/${id}/teacher`);
            // console.log(response.data[0]);
            setsupervisor(response.data[0].name);
        } catch (error) {
            console.error(`Error fetching `, error)
            return null // or handle the error in an appropriate way
        }
    }

    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-4 min-h-0 overflow-auto">
                    {status == 'approved' &&
                        <>
                            <p>Congrates {user.name}, {supervisor} has accepted your paper.</p>
                        </>
                    }
                    {status == 'Pending' &&
                        <>
                            <p>Dear {user.name}, Your paper is pending yet.</p>
                        </>
                    }
                    {status == 'rejected' &&
                        <>
                            <p>Dear {user.name}, {supervisor} has reject your proposal.</p>
                        </>

                    }
                    {status == 'modify' || status == 'modified' &&
                        <>
                            {
                                pdf?.status != 'modified' &&
                                <p>Dear {user.name}, {supervisor} wants some modifications to your proposal.</p>
                            }

                            {
                                pdf?.status == 'modified' &&
                                <p style={{ fontSize: '15px', color: 'orange', fontStyle: 'italic' }}>You modified this file and teacher has not seen yet</p>
                            }

                            <Grid
                                xs={12}
                                sm={6}
                                md={4}
                                sx={{ display: 'flex', justifyContent: 'start', marginTop: 5 }}
                            >

                                <Card
                                    variant="outlined"
                                    sx={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        backgroundColor: '#fff',
                                        marginBottom: 2,
                                        borderRadius: '8px'
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <Avatar alt="User" src={supervisor} />
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', marginLeft: '10px' }}
                                            >
                                                {supervisor}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                            {pdf?.reason}
                                        </Typography>

                                    </CardContent>
                                </Card>

                            </Grid>

                            <Grid
                                xs={12}
                                sm={6}
                                md={4}
                                sx={{}}
                            >
                                <ViewCommentedPdf pdf_id={pdf_id} />
                            </Grid>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ViewPaperResult