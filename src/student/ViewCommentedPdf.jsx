import React, { useState, useContext, useEffect } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Typography } from '@mui/material'
import { UserContext } from '../context/User'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { uploadStudentPDF } from '../apis/UploadStudentPdf'
import Button from '@mui/material/Button'
import axios from 'axios'

const ViewCommentedPdf = ({ pdf_id }) => {

    const [getId, setGetId] = useState()
    const [uploadPDFName, setUplaodPDFName] = useState(null)
    const [superVisor, setSuperVisor] = useState(null)
    const [pdfFile, setPDFFile] = useState(null)
    const [viewPdf, setViewPdf] = useState(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const fileType = ['application/pdf']
    const { user } = useContext(UserContext)

    const baseURL = 'http://localhost:5000/files/' //store this in ENV
    const navigate = useNavigate()

    const fetchPdfContent = async (pdf_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/pdf/${pdf_id}`)
            const fullURL = baseURL + response.data.pdfName
            setViewPdf(fullURL)
        } catch (error) {
            console.error('Error fetching PDF:', error)
        }
    }

    useEffect(() => {
        fetchPdfContent(pdf_id)
    }, [])


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]

        if (selectedFile && selectedFile.type === 'application/pdf') {
            setUplaodPDFName(selectedFile)
        }
        if (selectedFile && fileType.includes(selectedFile.type)) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setPDFFile(event.target.result)
            }
            reader.readAsDataURL(selectedFile)
            setUploadSuccess(true) // Set upload success message
        } else {
            setPDFFile(null)
            setUploadSuccess(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault() // Prevents the default form submission behavior
        if (pdfFile !== null) {
            setViewPdf(pdfFile)
            setUploadSuccess(false) // Remove upload success message
        } else {
            setViewPdf(null)
        }
    }
    const handleSubmission = async () => {

        const formData = new FormData()
        formData.append('pdfFile', uploadPDFName)
        formData.append('pdf_id', pdf_id)

        try {
            const response = await axios.post('http://localhost:5000/api/update_pdf_file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.message === 'Success') {
                toast.success(response.data.message);
            } else {
                // toast.(response.data);
            }
        } catch (error) {
            return { success: false, error: error.message }
        }

    }



    const newPlugin = defaultLayoutPlugin()

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '5px'
                }}
            >
                {(user.role !== 'Supervisor' && !user.pdf) ? (
                    <>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'center',
                                marginTop: '40px',
                                marginBottom: '20px',
                                fontWeight: 'bold'
                            }}
                        >
                            Change File
                        </Typography>
                        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                            <label htmlFor="pdfFileInput" className="custom-file-upload">
                                <input
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
                                        backgroundColor: '#2ecc71',
                                        border: '1px solid #27ae60',
                                        borderRadius: '5px',
                                        color: '#ffffff'
                                    }}
                                    onClick={() => document.getElementById('pdfFileInput').click()}
                                >
                                    Select PDF
                                </button>
                            </label>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    backgroundColor: '#3498db',
                                    border: '1px solid #2980b9',
                                    borderRadius: '5px',
                                    color: '#ffffff'
                                }}
                            >
                                View PDF
                            </button>
                            {uploadSuccess && (
                                <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
                                    Upload successful
                                </p>
                            )}
                        </form>
                    </>
                ) : null}

                <div style={{ width: '80%', maxWidth: 'auto', height: 'auto' }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        {viewPdf ? (
                            <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    border: '1px dashed #ccc',
                                    borderRadius: '5px',
                                    color: '#888'
                                }}
                            >
                                No PDF selected
                            </div>
                        )}
                    </Worker>
                </div>
                {user.role !== 'Supervisor' ? (
                    !user.pdf ? (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmission}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                backgroundColor: '#3498db',
                                border: '1px solid #2980b9',
                                borderRadius: '5px',
                                color: '#ffffff',
                                margin: '30px 0 60px'
                            }}
                        >
                            Submit PDF
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={() => navigate('/comments')}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                backgroundColor: '#3498db',
                                border: '1px solid #2980b9',
                                borderRadius: '5px',
                                color: '#ffffff',
                                margin: '30px 0 60px'
                            }}
                        >
                            View Comments
                        </button>
                    )
                ) : (
                    <>

                    </>
                )}
            </div>
        </>
    )
}

export default ViewCommentedPdf
