import React, { useContext, useEffect, useState, useRef } from 'react'
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


function Uploadpaper() {
    let { user } = useContext(UserContext);
    let navigate = useNavigate();

    let [fileselected, setfileselected] = useState(false);
    let pdfref = useRef(null);

    const handleFileChange = (e) => {
        setfileselected(true);

    }

    let submitpaper = async () => {
        const formData = new FormData()
        formData.append('pdfFile', pdfref.current.files[0])
        formData.append('studentId', user._id)
        formData.append('supervisor_id', user.supervisor)
        formData.append('pdf_type', 'paper');

        try {
            const response = await axios.post('http://localhost:5000/api/Student-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.status === 200) {
                console.log(response.data)
                navigate('/mypapers')
            } else {
                console.log(response.data)
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }


    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-4 min-h-0 overflow-auto">
                    <p>This document will be submitted to your supervisor</p>

                    <label htmlFor="pdfFileInput" className="custom-file-upload">
                        <input
                            ref={pdfref}
                            type="file"
                            id="pdfFileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className="btn btn-success"
                            style={{
                                marginRight: '10px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                border: '1px solid black',
                                borderRadius: '10px',
                                marginTop: '10px'
                            }}
                            onClick={() => document.getElementById('pdfFileInput').click()}
                        >
                            Select PDF
                        </button>
                    </label>
                    {
                        fileselected &&
                        <>
                            <p style={{ fontStyle: 'italic', color: 'gray' }}>Selected file : {pdfref.current.files[0].name}</p>
                            <button
                                type="button"
                                className="btn btn-success"
                                style={{
                                    marginRight: '10px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    border: '1px solid black',
                                    borderRadius: '10px',
                                    marginTop: '10px'
                                }}
                                onClick={() => { submitpaper() }}
                            >
                                Submit
                            </button>

                        </>
                    }

                </div>
            </div>
        </div>
    )
}

export default Uploadpaper