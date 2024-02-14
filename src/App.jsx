import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/Profile'
import { UserProvider } from './context/User'

import LoginPage from './pages/LoginPage'
import StudentsPage from './pages/Students'
import SignUpPage from './pages/RegisterPage'
import Proposal from './pages/Proposal'
import Notificaction from './components/Notification'
import CommentsPage from './pages/Comments'
import ViewComments from './pages/ViewComments'
import ApplicationForm from './pages/ApplicationForm'
import TemplatePage from './pages/ApplicationTemplate'
import Settings from './pages/Settings'
import axios from 'axios'

import './App.css'
import StudentRegistration from './Page/StudentRegistration'

import AdminDashboard from './Page/AdminDashboard'
// import Setting from "./Page/Setting";
import SendDocuments from './Page/SendDocuments'
import StudentRegisterData from './Page/StudentRegisterData'
import SendEmail from "./Page/SendEmail";
import Second_Email from "./Page/SendEmail1";
import TeacherRegistration from "./Page/TeacherRegistration";
import TeachersRegisterData from './Page/TeachersRegisterData'
import StudentUpdate from "./Page/StudentUpdate";
import TeacherUpdate from "./Page/TeacherUpdate";
import SideBar from './components/Sidebar/SideBar';
import ViewProposals from './supervisor/ViewProposals'
import VisitSingleProposal from './supervisor/VisitSingleProposal'
import MyProposal from './student/MyProposals';
import SupervisionResult from './student/SupervisionResult'
import Viewcommetties from './commettie/Viewcommetties'
import Addcommetti from './commettie/Addcommetti'
// import ViewSingleCommetti from './commettie/ViewSingleCommetti'
import Mycommetti from './student/Mycommetti'
import Uploadpaper from './student/Uploadpaper'
import Mypapers from './student/Mypapers'
import ViewPapers from './supervisor/ViewPapers'
import ViewPaperResult from './student/ViewPaperResult'
import Viewdac from './DAC/Viewdac'
import Adddac from './DAC/Adddac'
import SeeCommentsOnDoc from './student/SeeCommentsOnDoc'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true


function App() {
    return (
        <Router>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />}></Route>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/proposal" element={<MyProposal />} />
                    <Route path="/sendproposal" element={<Proposal />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/comments" element={<CommentsPage />} />
                    <Route path="/view-comments" element={<ViewComments />} />
                    <Route path="/application-form" element={<ApplicationForm />} />
                    <Route path="/templates" element={<TemplatePage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/students" element={<StudentsPage />} />
                    <Route path="/mycommetti" element={<Mycommetti />} />
                    <Route path="/register" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/studentRegistration" element={<StudentRegistration />} />
                    <Route path="/teacherRegistration" element={<TeacherRegistration />} />
                    <Route path='/view/proposals/supervisor' element={<ViewProposals />} />
                    <Route path='/proposals/VisitSingleProposal/:pdf_id' element={<VisitSingleProposal />} />
                    <Route path='/supervisionRequestResult/:pdf_id/:status' element={<SupervisionResult />} />
                    <Route path="/mypapers" element={<Mypapers />} />
                    <Route path="/uploadpaper" element={<Uploadpaper />} />
                    <Route path="/Viewpapers" element={<ViewPapers />} />
                    <Route path='/ViewPaperResult/:pdf_id/:status' element={<ViewPaperResult />} />
                    <Route path='/SeeCommentsOnDoc/:pdf_id/:role' element={<SeeCommentsOnDoc/>}/>

                    <Route
                        path="admin/*"
                        element={
                            <SideBar>
                                <Outlet />
                            </SideBar>
                        }
                    >
                        <Route path="admin/dashboard" element={<AdminDashboard />} />
                        <Route path="admin/sendEmail/:id" element={<SendEmail />} />
                        <Route path="admin/second_Email/:id" element={<Second_Email />} />
                        <Route path="admin/send-documents" element={<SendDocuments />} />
                        <Route path="admin/studentRegisterData" element={<StudentRegisterData />} />
                        <Route path="admin/teacherRegisterData" element={<TeachersRegisterData />} />
                        {/* <Route path="admin/settings" element={<Setting />} /> */}
                        <Route path="admin/update_Student/:id" element={<StudentUpdate />} />
                        <Route path="admin/update_Teacher/:id" element={<TeacherUpdate />} />
                        <Route path='admin/Viewcommetties' element={<Viewcommetties />} />
                        <Route path='admin/Viewcommetties/Addcommetti' element={<Addcommetti />} />

                        <Route path='admin/Viewdac' element={<Viewdac />} />
                        <Route path='admin/Viewdac/Adddac' element={<Adddac />} />
                        {/* <Route path='admin/ViewCommetti/:c_id' element={<ViewSingleCommetti />} /> */}
                    </Route>

                </Routes>
                <Notificaction />
            </UserProvider>
        </Router>
    )
}

export default App
