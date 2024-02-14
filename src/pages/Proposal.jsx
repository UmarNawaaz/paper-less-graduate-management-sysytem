// material-ui
import { Typography } from '@mui/material'

// project imports
import Grid from '@mui/material/Grid'
import { UserContext } from '../context/User'
import ViewPDF from '../components/ViewPDF'
import CommentsSection from '../components/CommentSection'
import { BoxWrapper } from '../Utils/BoxWrapper'
import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'

import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'

const Proposal = () => {
    const location = useLocation()
    const { user, setUpdatePDF } = useContext(UserContext)

    if (location?.state?.update) {
        setUpdatePDF(location?.state?.update)
    }
    const [id, setId] = useState(location?.state?.pdfId)

    const [getStatus, setGetStatus] = useState()
    const [getPdfName, setGetPdfName] = useState()

    useEffect(() => {
    }, [])


    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-4 min-h-0 overflow-auto">
                    <Grid container spacing={2}>

                        <Grid item xs={user.role !== 'Supervisor' ? 12 : 9}>
                            <BoxWrapper>
                                <ViewPDF pdfName={getPdfName} StudentStatus={getStatus} pdfId={id} />
                            </BoxWrapper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>

    )
}

export default Proposal
