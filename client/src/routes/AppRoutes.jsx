import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import ChangePassword from '../pages/auth/ChangePassword.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import PrivateRoute from './PrivateRoute.jsx';

// ==================== LANDING ====================
import LandingLayout from '../components/landing/LandingLayout.jsx';
import Home from '../pages/public/Home.jsx';
import About from '../pages/public/About.jsx';
import Features from '../pages/public/Features.jsx';
import Contact from '../pages/public/Contact.jsx';

// ==================== ADMIN ====================
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import StudentList from '../pages/admin/Students/StudentList.jsx';
import TeacherList from '../pages/admin/Teachers/TeacherList.jsx';
import ClassList from '../pages/admin/Classes/ClassList.jsx';
import AttendanceMark from '../pages/admin/Attendance/AttendanceMark.jsx';
import FeeList from '../pages/admin/Fees/FeeList.jsx';
import ExamList from '../pages/admin/Exams/ExamList.jsx';
import MarksEntry from '../pages/admin/Exams/MarksEntry.jsx';
import HomeworkList from '../pages/admin/Homework/HomeworkList.jsx';
import LibraryList from '../pages/admin/Library/LibraryList.jsx';
import TransportList from '../pages/admin/Transport/TransportList.jsx';
import NoticeList from '../pages/admin/Notices/NoticeList.jsx';
import ReportsPage from '../pages/admin/Reports/ReportPage.jsx';
import UserList from '../pages/admin/Users/UserList.jsx';

// ==================== DASHBOARDS ====================
import TeacherDashboard from '../pages/teacher/Dashboard.jsx';
import StudentDashboard from '../pages/student/Dashboard.jsx';
import ParentDashboard from '../pages/parent/Dashboard.jsx';
import AccountantDashboard from '../pages/accountant/Dashboard.jsx';

// ==================== ACCOUNTANT PAGES ====================
import AccountantReceipts from '../pages/accountant/Receipts.jsx';
import AccountantFeeStructure from '../pages/accountant/FessStructure.jsx';

// ==================== SHARED ====================
import Unauthorized from '../pages/shared/Unauthorized.jsx';
import NotFound from '../pages/shared/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ==================== PUBLIC LANDING ==================== */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ==================== LOGIN ==================== */}
      <Route path="/login" element={<Login />} />

      {/* ==================== APP (DASHBOARDS) ==================== */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/change-password" element={<ChangePassword />} />

        {/* -------- ADMIN -------- */}
        <Route path="/admin/dashboard"  element={<PrivateRoute allowedRoles={['Admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/students"   element={<PrivateRoute allowedRoles={['Admin']}><StudentList /></PrivateRoute>} />
        <Route path="/admin/teachers"   element={<PrivateRoute allowedRoles={['Admin']}><TeacherList /></PrivateRoute>} />
        <Route path="/admin/classes"    element={<PrivateRoute allowedRoles={['Admin']}><ClassList /></PrivateRoute>} />
        <Route path="/admin/attendance" element={<PrivateRoute allowedRoles={['Admin','Teacher']}><AttendanceMark /></PrivateRoute>} />
        <Route path="/admin/fees"       element={<PrivateRoute allowedRoles={['Admin','Accountant']}><FeeList /></PrivateRoute>} />
        <Route path="/admin/exams"      element={<PrivateRoute allowedRoles={['Admin','Teacher']}><ExamList /></PrivateRoute>} />
        <Route path="/admin/exams/:examId/marks" element={<PrivateRoute allowedRoles={['Admin','Teacher']}><MarksEntry /></PrivateRoute>} />
        <Route path="/admin/homework"   element={<PrivateRoute allowedRoles={['Admin','Teacher']}><HomeworkList /></PrivateRoute>} />
        <Route path="/admin/library"    element={<PrivateRoute allowedRoles={['Admin']}><LibraryList /></PrivateRoute>} />
        <Route path="/admin/transport"  element={<PrivateRoute allowedRoles={['Admin']}><TransportList /></PrivateRoute>} />
        <Route path="/admin/notices"    element={<PrivateRoute allowedRoles={['Admin','Teacher']}><NoticeList /></PrivateRoute>} />
        <Route path="/admin/reports"    element={<PrivateRoute allowedRoles={['Admin','Accountant']}><ReportsPage /></PrivateRoute>} />
        <Route path="/admin/users"      element={<PrivateRoute allowedRoles={['Admin']}><UserList /></PrivateRoute>} />

        {/* -------- TEACHER -------- */}
        <Route path="/teacher/dashboard"  element={<PrivateRoute allowedRoles={['Teacher']}><TeacherDashboard /></PrivateRoute>} />
        <Route path="/teacher/attendance" element={<PrivateRoute allowedRoles={['Teacher','Admin']}><AttendanceMark /></PrivateRoute>} />
        <Route path="/teacher/homework"   element={<PrivateRoute allowedRoles={['Teacher','Admin']}><HomeworkList /></PrivateRoute>} />
        <Route path="/teacher/exams"      element={<PrivateRoute allowedRoles={['Teacher','Admin']}><ExamList /></PrivateRoute>} />
        <Route path="/teacher/exams/:examId/marks" element={<PrivateRoute allowedRoles={['Teacher','Admin']}><MarksEntry /></PrivateRoute>} />
        <Route path="/teacher/notices"    element={<PrivateRoute allowedRoles={['Teacher','Admin']}><NoticeList /></PrivateRoute>} />

        {/* -------- STUDENT -------- */}
        <Route path="/student/dashboard"  element={<PrivateRoute allowedRoles={['Student']}><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/attendance" element={<PrivateRoute allowedRoles={['Student','Admin']}><AttendanceMark /></PrivateRoute>} />
        <Route path="/student/homework"   element={<PrivateRoute allowedRoles={['Student','Admin']}><HomeworkList /></PrivateRoute>} />
        <Route path="/student/exams"      element={<PrivateRoute allowedRoles={['Student','Admin']}><ExamList /></PrivateRoute>} />
        <Route path="/student/fees"       element={<PrivateRoute allowedRoles={['Student','Admin','Accountant']}><FeeList /></PrivateRoute>} />
        <Route path="/student/library"    element={<PrivateRoute allowedRoles={['Student','Admin']}><LibraryList /></PrivateRoute>} />
        <Route path="/student/notices"    element={<PrivateRoute allowedRoles={['Student','Admin']}><NoticeList /></PrivateRoute>} />

        {/* -------- PARENT -------- */}
        <Route path="/parent/dashboard"  element={<PrivateRoute allowedRoles={['Parent']}><ParentDashboard /></PrivateRoute>} />
        <Route path="/parent/attendance" element={<PrivateRoute allowedRoles={['Parent','Admin']}><AttendanceMark /></PrivateRoute>} />
        <Route path="/parent/results"    element={<PrivateRoute allowedRoles={['Parent','Admin']}><ExamList /></PrivateRoute>} />
        <Route path="/parent/fees"       element={<PrivateRoute allowedRoles={['Parent','Admin','Accountant']}><FeeList /></PrivateRoute>} />
        <Route path="/parent/notices"    element={<PrivateRoute allowedRoles={['Parent','Admin']}><NoticeList /></PrivateRoute>} />

        {/* -------- ACCOUNTANT -------- */}
        <Route path="/accountant/dashboard"     element={<PrivateRoute allowedRoles={['Accountant']}><AccountantDashboard /></PrivateRoute>} />
        <Route path="/accountant/fee-structure" element={<PrivateRoute allowedRoles={['Accountant','Admin']}><AccountantFeeStructure /></PrivateRoute>} />
        <Route path="/accountant/receipts"      element={<PrivateRoute allowedRoles={['Accountant','Admin']}><AccountantReceipts /></PrivateRoute>} />
        <Route path="/accountant/fees"          element={<PrivateRoute allowedRoles={['Accountant','Admin']}><FeeList /></PrivateRoute>} />
        <Route path="/accountant/reports"       element={<PrivateRoute allowedRoles={['Accountant','Admin']}><ReportsPage /></PrivateRoute>} />
      </Route>

      {/* ==================== FALLBACK ==================== */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}