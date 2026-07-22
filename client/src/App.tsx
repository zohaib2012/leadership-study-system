import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useAuthStore } from '@/store/auth-store'

import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

import HomePage from '@/pages/public/HomePage'
import AboutPage from '@/pages/public/AboutPage'
import ServicesPage from '@/pages/public/ServicesPage'
import FacultyPage from '@/pages/public/FacultyPage'
import ContactPage from '@/pages/public/ContactPage'
import PricingPage from '@/pages/public/PricingPage'
import BlogPage from '@/pages/public/BlogPage'
import BlogPostPage from '@/pages/public/BlogPostPage'
import RegisterPage from '@/pages/public/RegisterPage'
import PrivacyPage from '@/pages/public/PrivacyPage'
import TermsPage from '@/pages/public/TermsPage'

import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import StudentList from '@/pages/admin/StudentList'
import StudentForm from '@/pages/admin/StudentForm'
import StudentProfile from '@/pages/admin/StudentProfile'
import TeacherList from '@/pages/admin/TeacherList'
import TeacherForm from '@/pages/admin/TeacherForm'
import ClassList from '@/pages/admin/ClassList'
import SubjectList from '@/pages/admin/SubjectList'
import TimetableBuilder from '@/pages/admin/TimetableBuilder'
import AttendanceMark from '@/pages/admin/AttendanceMark'
import AttendanceReport from '@/pages/admin/AttendanceReport'
import FeeStructure from '@/pages/admin/FeeStructure'
import FeeChallans from '@/pages/admin/FeeChallans'
import FeeCollection from '@/pages/admin/FeeCollection'
import PendingFees from '@/pages/admin/PendingFees'
import HomeworkList from '@/pages/admin/HomeworkList'
import HomeworkForm from '@/pages/admin/HomeworkForm'
import ReportsPage from '@/pages/admin/ReportsPage'
import SmsCompose from '@/pages/admin/SmsCompose'
import Announcements from '@/pages/admin/Announcements'
import LeaveRequests from '@/pages/admin/LeaveRequests'
import SettingsPage from '@/pages/admin/SettingsPage'
import ActivityLogs from '@/pages/admin/ActivityLogs'

import TeacherDashboard from '@/pages/teacher/TeacherDashboard'
import TeacherClasses from '@/pages/teacher/TeacherClasses'
import TeacherAttendance from '@/pages/teacher/TeacherAttendance'
import TeacherTimetable from '@/pages/teacher/TeacherTimetable'
import TeacherHomework from '@/pages/teacher/TeacherHomework'
import TeacherStudents from '@/pages/teacher/TeacherStudents'
import TeacherSalary from '@/pages/teacher/TeacherSalary'
import TeacherProfile from '@/pages/teacher/TeacherProfile'

import StudentDashboard from '@/pages/student/StudentDashboard'
import StudentSubjects from '@/pages/student/StudentSubjects'
import StudentTimetable from '@/pages/student/StudentTimetable'
import StudentAttendance from '@/pages/student/StudentAttendance'
import StudentFees from '@/pages/student/StudentFees'
import StudentHomework from '@/pages/student/StudentHomework'
import StudentLeaves from '@/pages/student/StudentLeaves'
import StudentProfile from '@/pages/student/StudentProfile'

import ParentDashboard from '@/pages/parent/ParentDashboard'

import SuperDashboard from '@/pages/super-admin/SuperDashboard'
import TenantList from '@/pages/super-admin/TenantList'
import SuperStudents from '@/pages/super-admin/SuperStudents'
import SuperTeachers from '@/pages/super-admin/SuperTeachers'
import SuperClasses from '@/pages/super-admin/SuperClasses'
import SuperSubjects from '@/pages/super-admin/SuperSubjects'
import SuperTimetable from '@/pages/super-admin/SuperTimetable'
import SuperAttendance from '@/pages/super-admin/SuperAttendance'
import SuperFees from '@/pages/super-admin/SuperFees'
import SuperHomework from '@/pages/super-admin/SuperHomework'
import SuperCommunication from '@/pages/super-admin/SuperCommunication'
import SuperAnnouncements from '@/pages/super-admin/SuperAnnouncements'
import SuperReports from '@/pages/super-admin/SuperReports'
import SuperSettings from '@/pages/super-admin/SuperSettings'
import SuperLogs from '@/pages/super-admin/SuperLogs'

export default function App() {
  const { initialize, isInitialized } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['SUPER_ADMIN']} />}>
            <Route element={<DashboardLayout role="super-admin" />}>
              <Route path="/super-admin/dashboard" element={<SuperDashboard />} />
              <Route path="/super-admin/tenants" element={<TenantList />} />
              <Route path="/super-admin/students" element={<SuperStudents />} />
              <Route path="/super-admin/teachers" element={<SuperTeachers />} />
              <Route path="/super-admin/classes" element={<SuperClasses />} />
              <Route path="/super-admin/subjects" element={<SuperSubjects />} />
              <Route path="/super-admin/timetable" element={<SuperTimetable />} />
              <Route path="/super-admin/attendance" element={<SuperAttendance />} />
              <Route path="/super-admin/fees" element={<SuperFees />} />
              <Route path="/super-admin/homework" element={<SuperHomework />} />
              <Route path="/super-admin/communication/sms" element={<SuperCommunication />} />
              <Route path="/super-admin/communication/announcements" element={<SuperAnnouncements />} />
              <Route path="/super-admin/reports" element={<SuperReports />} />
              <Route path="/super-admin/settings" element={<SuperSettings />} />
              <Route path="/super-admin/logs" element={<SuperLogs />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN', 'SUB_ADMIN', 'ACCOUNTANT']} />}>
            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentList />} />
              <Route path="/admin/students/add" element={<StudentForm />} />
              <Route path="/admin/students/:id" element={<StudentProfile />} />
              <Route path="/admin/students/:id/edit" element={<StudentForm />} />
              <Route path="/admin/teachers" element={<TeacherList />} />
              <Route path="/admin/teachers/add" element={<TeacherForm />} />
              <Route path="/admin/classes" element={<ClassList />} />
              <Route path="/admin/subjects" element={<SubjectList />} />
              <Route path="/admin/timetable" element={<TimetableBuilder />} />
              <Route path="/admin/attendance" element={<AttendanceMark />} />
              <Route path="/admin/attendance/reports" element={<AttendanceReport />} />
              <Route path="/admin/fees/structure" element={<FeeStructure />} />
              <Route path="/admin/fees/challans" element={<FeeChallans />} />
              <Route path="/admin/fees/collect" element={<FeeCollection />} />
              <Route path="/admin/fees/pending" element={<PendingFees />} />
              <Route path="/admin/homework" element={<HomeworkList />} />
              <Route path="/admin/homework/create" element={<HomeworkForm />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/communication/sms" element={<SmsCompose />} />
              <Route path="/admin/communication/announcements" element={<Announcements />} />
              <Route path="/admin/leaves" element={<LeaveRequests />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/logs" element={<ActivityLogs />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['TEACHER']} />}>
            <Route element={<DashboardLayout role="teacher" />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/classes" element={<TeacherClasses />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/timetable" element={<TeacherTimetable />} />
              <Route path="/teacher/homework" element={<TeacherHomework />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/salary" element={<TeacherSalary />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['STUDENT']} />}>
            <Route element={<DashboardLayout role="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/subjects" element={<StudentSubjects />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/fees" element={<StudentFees />} />
              <Route path="/student/homework" element={<StudentHomework />} />
              <Route path="/student/leaves" element={<StudentLeaves />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['PARENT']} />}>
            <Route element={<DashboardLayout role="parent" />}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
