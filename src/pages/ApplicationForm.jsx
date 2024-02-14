// material-ui
import { Typography } from '@mui/material'

// project imports
import Grid from '@mui/material/Grid'
import { UserContext } from '../context/User'
import ViewPDF from '../components/ViewPDF'
import CommentsSection from '../components/CommentSection'
import { BoxWrapper } from '../Utils/BoxWrapper'
import { useContext } from 'react'
import ViewApplicationPDF from '../components/ViewApplicationPDF'
import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'


const ApplicationForm = () => {
    const initialComments = []
    const { user } = useContext(UserContext)

    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-4 min-h-0 overflow-auto">
                    <Grid container spacing={2}>
                        <Grid item xs={user.role !== 'Supervisor' ? 12 : 9}>
                            <BoxWrapper>
                                <ViewApplicationPDF />
                            </BoxWrapper>
                        </Grid>

                        {user.role === 'Supervisor' && (
                            <Grid item xs={3}>
                                <BoxWrapper>
                                    <CommentsSection
                                        comments={initialComments}
                                        onComment={(newComment) => console.log(newComment)}
                                    />
                                </BoxWrapper>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </div>
        </div>

    )
}

export default ApplicationForm
