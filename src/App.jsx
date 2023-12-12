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
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true
import './App.css'
import StudentRegistration from './Page/StudentRegistration'

// import Home from "./Page/Home";
// import OthersLogin from "./Page/OthersLogin";
// import StudentDashboard from "./Page/StudentDashboard";
// import StudentRegistration from './Page/StudentRegistration'
// import SideBar from './components/SideBar/SideBar'
import AdminDashboard from './Page/AdminDashboard'
// import Setting from "./Page/Setting";
import SendDocuments from './Page/SendDocuments'
import StudentRegisterData from './Page/StudentRegisterData'
import SendEmail from "./Page/SendEmail";
import Second_Email from "./Page/SendEmail1";
import TeacherRegistration from "./Page/TeacherRegistration";
import TeachersRegisterData from './Page/TeachersRegisterData'
// import SupervisorDash from "./Page/SupervisorDash";
// import ExternalExaminerDash from "./Page/ExternalExaminerDash";
// import DAC from "./Page/DAC";
// import CorrdinateCommitte from "./Page/CorrdinateCommitte";
import StudentUpdate from "./Page/StudentUpdate";
import TeacherUpdate from "./Page/TeacherUpdate";
import SideBar from './components/Sidebar/SideBar';
function App() {
    return (
        <Router>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="proposal" element={<Proposal />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="comments" element={<CommentsPage />} />
                        <Route path="view-comments" element={<ViewComments />} />
                        <Route path="application-form" element={<ApplicationForm />} />
                        <Route path="templates" element={<TemplatePage />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="students" element={<StudentsPage />} />
                    </Route>
                    <Route path="/register" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/studentRegistration" element={<StudentRegistration />} />
                    <Route path="/teacherRegistration" element={<TeacherRegistration />} />
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
                        <Route path="admin/update_Student/:id" element={<StudentUpdate/>} />
                        <Route path="admin/update_Teacher/:id" element={<TeacherUpdate/>} />
                    </Route>
                </Routes>
                <Notificaction />
            </UserProvider>
        </Router>
    )
}

export default App
