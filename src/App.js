
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/register/Register';

import Project from './pages/Project';

import EditProject from './components/projects/EditProject';
import Member from './components/member/Member';
import ViewProject from './components/projects/ViewProject';
import Tasks from './pages/Tasks';
import EditTask from './components/tasks/EditTask';

import User from './components/user/User'
import { Context } from './components/context/Context';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import Logout from './pages/Logout';
import AddTask from './components/tasks/AddTask';

import Comments from './components/tasks/Comment';
import AddProject from './components/projects/AddProject';
import PrivateOutlet from './components/router/PrivateOutlet';
import PrivateRoute from './components/router/PrivateRoute';
import PicturesWall from './components/member/PicturesWall';

import Members from './admin/components/user/Members';

import PageLayout from './admin/components/layout/PageLayout'
function App() {
  return (
    <Context>
      <Router>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/img" element={<PicturesWall/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/com" element={<Comments/>}/>
          <Route path="/admin/users" element={<PageLayout title="Quản lý thành viên"><Members /></PageLayout>} />
          <Route element={<PrivateOutlet />}>
            <Route path="/admin/users" element={<PrivateRoute title="Quản lý thành viên"><Members /></PrivateRoute>} />
            <Route path="dashboard" element={<PrivateRoute title="dashboard"><Dashboard/></PrivateRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/projects" element={<PrivateRoute title="Dự án"><Project /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute title="Công việc được giao"><Tasks type="task"/> </PrivateRoute>} />
            <Route path="/project/:id/tasks/" element={<PrivateRoute title="Dự án"><Tasks type="project" /></PrivateRoute>} />
            <Route path="/project/:projectId/task/edit/:id" element={<PrivateRoute title="xem chi tiết công việc"><EditTask /></PrivateRoute>} />
            <Route path="/tasks/add/:parent_id/project/:project_id" element={<PrivateRoute title="thêm công việc"><AddTask /></PrivateRoute>} />
            <Route path="/tasks/add/" element={<PrivateRoute title="Thêm công việc"><AddTask /></PrivateRoute>} />
            <Route path="/projects/add" element={<PrivateRoute title="Thêm dự án mới"><AddProject /></PrivateRoute>} />
            <Route path="/projects/edit/:id" element={<PrivateRoute title="xem dự án"><EditProject /></PrivateRoute>} />
            <Route path="/projects/view/:id" element={<PrivateRoute title="Xem dự án"><ViewProject /></PrivateRoute>} />
            <Route path="/members/:projectId" element={<PrivateRoute title="Xem thành viên"><Member /></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute title="Lịch"><CalendarPage/></PrivateRoute>} />
            <Route path="/user" element={<PrivateRoute title="Quản lý tài khoản"><User/></PrivateRoute>} />
            <Route path="/taskovertime" element={<PrivateRoute title="Công việc quá hạn"><Tasks type="taskovertime" /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
      </Context>
  );
}

export default App;
