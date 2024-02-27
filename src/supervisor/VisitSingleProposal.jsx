import React, { useState, useContext, useEffect } from 'react'
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
import { updateStudentPDF } from '../apis/Updatepdf'
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'
import CommentsSection from '../components/CommentSection'
import Grid from '@mui/material/Grid'
import { BoxWrapper } from '../Utils/BoxWrapper'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { Typography } from '@mui/material'


function VisitSingleProposal() {

    const { pdf_id } = useParams();

    const [viewPdf, setViewPdf] = useState(null)
    const [pdfName, setpdfName] = useState('');
    const [pdfid, setpdfid] = useState(pdf_id);

    const fileType = ['application/pdf']
    const { user, setUser, updatePDf, setUpdatePDF } = useContext(UserContext)

    const baseURL = 'http://localhost:5000/files/' //store this in ENV
    const navigate = useNavigate()

    let [dacs, setdacs] = useState([]);
    let [selecteddac, setselecteddac] = useState(null);

    let get_all_dacs = async () => {
        const response = await axios.get("/get_all_dacs");
        setdacs(response.data);
    }

    useEffect(() => {

        const fetchPdfContent = async (pdf) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/pdf/${pdf}`)
                const fullURL = baseURL + response.data.pdfName
                setViewPdf(fullURL)

            } catch (error) {
                console.error('Error fetching PDF:', error)
            }
        }

        if (pdfid || pdfName) {
            if (pdfid) {
                fetchPdfContent(pdfid)
            }
        }

        if (user?.role == 'CoordinateCommitte') {
            get_all_dacs();
        }
    }, [viewPdf, pdfid])

    let [modify, setmodify] = useState(false);

    const Feedback = async (text) => {

        if (modify) {
            try {
                if (user.role == 'CoordinateCommitte' || user.role == 'DAC') {
                    modify_paper(text);
                }
                else {
                    if (updatedpdf != null) {
                        const formData = new FormData();
                        formData.append('pdfFile', updatedpdf);

                        await axios.post('http://localhost:5000/api/upload_pdf', formData).then(async (response) => {
                            console.log(response.data);

                            let resp = await axios.post('http://localhost:5000/modify_paper', {
                                pdf_id: pdf_id,
                                'teacher_id': user._id,
                                'reason': text,
                                'updated_pdf_name': response.data
                            });
                            toast.success(resp.data.result)
                            setmodify(false);
                            navigate('/view/proposals/supervisor')
                        })

                    }
                    else {
                        let response = await axios.post('http://localhost:5000/modify_paper', {
                            pdf_id: pdf_id,
                            'teacher_id': user._id,
                            'reason': text
                        });
                        toast.success(response.data.result)
                        setmodify(false);
                        navigate('/view/proposals/supervisor')
                    }

                }

                // Handle success, update state or perform additional actions
            } catch (error) {
                toast.success('Something Went Wrong')
                console.error('Error making PUT request:', error)
                // Handle error, show a message to the user, etc.
            }
        }
        else {
            try {
                if (user.role == 'CoordinateCommitte' || user.role == 'DAC') {
                    reject_paper(text);
                }
                else {
                    let response = await axios.post('http://localhost:5000/reject_paper', {
                        pdf_id: pdf_id,
                        'teacher_id': user._id,
                        'reason': text

                    });
                    toast.success(response.data.result)
                    navigate('/view/proposals/supervisor')
                }

                // Handle success, update state or perform additional actions
            } catch (error) {
                toast.success('Something Went Wrong')
                console.error('Error making PUT request:', error)
                // Handle error, show a message to the user, etc.
            }
        }
    }


    const handleClick = async (action) => {
        // Call the function to store state based on the action (approve, reject, modify)
        console.log(action)
        if (action === 'Reject') {
            //action here incase to show modal for other button
            openModal()

        }
        else if (action == 'Approved') {
            try {
                if (user.role == 'CoordinateCommitte' || user.role == 'DAC') {
                    approve_paper();
                }
                else {

                    let response = await axios.post('http://localhost:5000/approve_paper', {
                        pdf_id: pdf_id,
                        'teacher_id': user._id
                    });
                    toast.success(response.data.result)
                    navigate('/view/proposals/supervisor')
                }
                // Handle success, update state or perform additional actions
            } catch (error) {
                toast.success('Something Went Wrong')
                console.error('Error making PUT request:', error)
                // Handle error, show a message to the user, etc.
            }
        }
        else if (action == 'Modify') {
            openModal();
            setmodify(true);
        }

    }

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }
    const handleFeedbackSubmit = (feedback) => {
        Feedback(feedback)
    }
    const newPlugin = defaultLayoutPlugin()


    let approve_paper = async (reason) => {
        let response = await axios.post('http://localhost:5000/approve_paper', {
            pdf_id: pdf_id,
            'teacher_id': user._id
        });
        navigate('/Viewpapers')
    }

    let reject_paper = async (reason) => {
        let response = await axios.post('http://localhost:5000/reject_paper', {
            pdf_id: pdf_id,
            'teacher_id': user._id,
            'reason': reason

        });
        navigate('/Viewpapers')
    }

    let modify_paper = async (reason) => {

        if (updatedpdf != null) {
            const formData = new FormData();
            formData.append('pdfFile', updatedpdf);

            await axios.post('http://localhost:5000/api/upload_pdf', formData).then(async (response) => {
                console.log(response.data);

                let resp = await axios.post('http://localhost:5000/modify_paper', {
                    pdf_id: pdf_id,
                    'teacher_id': user._id,
                    'reason': reason,
                    'updated_pdf_name': response.data
                });
                toast.success(resp.data.result)
                setmodify(false);
                navigate('/Viewpapers')
            })

        }
        else {
            let response = await axios.post('http://localhost:5000/modify_paper', {
                pdf_id: pdf_id,
                'teacher_id': user._id,
                'reason': reason
            });
            navigate('/Viewpapers')
        }
    }

    let forwardtocommetti = async () => {

        let response = await axios.post('/forward_to_commetti', {
            'pdf_id': pdf_id,
            'supervisor_id': user?._id
        })

        if (response.status == 200) {
            toast.success('Forwarded to commetti members!')
        }
        else {
            toast.error("Error forwarding");
        }

    }

    let forwardtodac = async () => {

        if (selecteddac == null) {
            alert('select DAC')
        }
        else {
            let response = await axios.post('/forward_to_dac', {
                'pdf_id': pdf_id,
                'dac_id': selecteddac,
                'commetti_member_id':user?._id
            })

            if (response.status == 200) {
                toast.success('Forwarded to DAC members!')
            }
            else {
                toast.error("Error forwarding");
            }
        }
    }

    let [updatedpdf, setupdatedpdf] = useState(null);

    return (
        <>
            <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex-1 p-4 min-h-0 overflow-auto">
                        <div className='col-12 d-flex flex-wrap'>

                            <div className='col-12 col-lg-8'>
                                <div >

                                    <div >
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
                                                    Loading pdf...
                                                </div>
                                            )}
                                        </Worker>
                                    </div>
                                    <div
                                        className='d-flex flex-wrap justify-content-center my-2'
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            style={{
                                                padding: '8px 16px',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                border: '1px solid #2ecc71',
                                                backgroundColor: '#2ecc71',
                                                color: '#ffffff',
                                                marginRight: '20px'
                                            }}
                                            onClick={() => handleClick('Approved')}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            style={{
                                                padding: '8px 16px',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                border: '1px solid #e74c3c',
                                                backgroundColor: '#e74c3c',
                                                color: '#ffffff',
                                                marginRight: '20px'
                                            }}
                                            onClick={() => handleClick('Reject')}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-warning"
                                            style={{
                                                padding: '8px 16px',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                border: '1px solid #f39c12',
                                                backgroundColor: '#f39c12',
                                                color: '#ffffff'
                                            }}
                                            onClick={() => handleClick('Modify')}
                                        >
                                            Modify
                                        </button>
                                        {
                                            user?.role == 'Supervisor' &&
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    style={{
                                                        padding: '8px 16px',
                                                        cursor: 'pointer',
                                                        borderRadius: '5px',
                                                        border: '1px solid #1565C0',
                                                        backgroundColor: '#1565C0',
                                                        color: '#ffffff',
                                                        marginLeft: '20px'

                                                    }}
                                                    onClick={() => forwardtocommetti()}
                                                >
                                                    Forward to commetti
                                                </button>
                                            </>
                                        }

                                    </div>
                                    {
                                        user?.role == 'CoordinateCommitte' &&
                                        <>
                                            <div style={{ display: 'flex', width: '100%' }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    style={{
                                                        padding: '8px 16px',
                                                        cursor: 'pointer',
                                                        borderRadius: '5px',
                                                        border: '1px solid #1565C0',
                                                        backgroundColor: '#1565C0',
                                                        color: '#ffffff',
                                                        marginLeft: '20px'

                                                    }}
                                                    onClick={() => forwardtodac()}
                                                >
                                                    Forward to DAC
                                                </button>
                                                <FormControl
                                                    style={{
                                                        marginLeft: '20px',
                                                        width: '50%',
                                                    }}
                                                >
                                                    <InputLabel id="supervisor-label">Select DAC</InputLabel>
                                                    <Select
                                                        labelId="supervisor-label"
                                                        id="supervisor-select"
                                                        label="Select Supervisor"
                                                        onChange={(e) => setselecteddac(e.target.value)}
                                                    >

                                                        {dacs.map((dac, index) => (
                                                            <MenuItem key={index} value={dac._id}>
                                                                {dac.dac_title}
                                                            </MenuItem>
                                                        ))}

                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div>
                                    <FeedbackModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFeedbackSubmit} setupdatedpdf={setupdatedpdf} />
                                </div>
                            </div>

                            <div className='col-12 col-lg-4'>
                                <BoxWrapper>
                                    <CommentsSection pdf_id={pdfid} />
                                </BoxWrapper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VisitSingleProposal