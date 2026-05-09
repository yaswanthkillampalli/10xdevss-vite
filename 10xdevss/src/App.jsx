import { Routes, Route } from 'react-router'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/portfolio/Projects.jsx'
import MyProjects from './pages/portfolio/MyProjects.jsx'
import MyPublications from './pages/portfolio/MyPublications.jsx'
import MyAchievements from './pages/portfolio/MyAchievements.jsx'
import Skills from './pages/portfolio/Skills.jsx'
import Experience from './pages/portfolio/Experience.jsx'
import Certifications from './pages/portfolio/Certifications.jsx'
import Publications from './pages/portfolio/Publications.jsx'
import Achievements from './pages/portfolio/Achievements.jsx'
import PublicProfile from './pages/profile/PublicProfile.jsx'
import MyProfile from './pages/profile/MyProfile.jsx'
import Settings from './pages/settings/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AdminProtectedRoute from './routes/AdminProtectedRoute.jsx'
import FacultyAdminProtectedRoute from './routes/FacultyAdminProtectedRoute.jsx'
import Admin from './pages/admin/Admin.jsx'
import SearchStudents from './pages/faculty/SearchStudents.jsx'

export default function App() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="profile/:userId" element={<PublicProfile />} />
            
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="portfolio/projects" element={<MyProjects />} />
                    <Route path="portofolio/projects" element={<MyProjects />} />
                    <Route path="portfolio/publications" element={<MyPublications />} />
                    <Route path="portofolio/publications" element={<MyPublications />} />
                    <Route path="portfolio/achievements" element={<MyAchievements />} />
                    <Route path="portofolio/achievements" element={<MyAchievements />} />
                    <Route path="portfolio/experience" element={<Experience />} />
                    <Route path="portfolio/certifications" element={<Certifications />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="publications" element={<Publications />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="portfolio/skills" element={<Skills />} />
                    <Route path="settings" element={<Settings />} />
                    <Route element={<FacultyAdminProtectedRoute />}>
                        <Route path="search-students" element={<SearchStudents />} />
                    </Route>
                            <Route element={<AdminProtectedRoute />}>
                                <Route path="admin" element={<Admin />} />
                            </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}