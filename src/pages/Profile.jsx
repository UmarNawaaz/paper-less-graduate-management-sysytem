import { Typography } from '@mui/material'
import { useContext } from 'react'

import { BoxWrapper } from '../Utils/BoxWrapper'
import UploadProfile from '../components/Profile/UploadProfile'
import UserProfileDashboard from '../components/Profile/UserProfileDashBoard'
import { UserContext } from '../context/User'
import Password from '../components/Password'

import Sidebar from '../components/shared/Sidebar'
import Header from '../components/shared/Header'

const ProfilePage = () => {
    const { user } = useContext(UserContext)

    return (
        <>
            <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex-1 p-4 min-h-0 overflow-auto">
                        <UserProfileDashboard userProfileData={user} />
                        <UploadProfile />
                    </div>
                </div>
            </div>

        </>
    )
}

export default ProfilePage
