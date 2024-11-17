import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.scss';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Home from './pages/Home/Home';
import PostDetail from './pages/PostDetail/PostDetail';
import MyProfile from './pages/MyProfile/MyProfile';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';
import Overview from './pages/Dashboard/Overview/Overview';
import PostList from './pages/Dashboard/Posts/PostList';
import EditPost from './pages/Dashboard/Posts/EditPost/EditPost';
import UserList from './pages/Dashboard/Users/UserList';
import EditUser from './pages/Dashboard/Users/EditUser/EditUser';
import CreateUser from './pages/Dashboard/Users/CreateUser/CreateUser';
import CategoryList from './pages/Dashboard/Categories/CategoryList';
import EditCategory from './pages/Dashboard/Categories/EditCategory/EditCategory';
import CreateCategory from './pages/Dashboard/Categories/CreateCategory/CreateCategory';
import RoleBasedRoute from './pages/RoleBasedRoute';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route
              path='/dashboard' 
              element={
                <RoleBasedRoute allowedRole='ADMIN' redirectPath='/unauthorized'>
                  <Dashboard />
                </RoleBasedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path='posts' element={<PostList />} />
              <Route path='posts/edit/:postId' element={<EditPost />} />
              <Route path='users' element={<UserList />} />
              <Route path='users/edit/:userId' element={<EditUser />} />
              <Route path='users/create' element={<CreateUser />} />
              <Route path='categories' element={<CategoryList />} />
              <Route path='categories/edit/:categoryId' element={<EditCategory />} />
              <Route path='categories/create' element={<CreateCategory />} />
            </Route>
            <Route path='/post/:slug' element={<PostDetail />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/create-post' element={<CreatePost  />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
