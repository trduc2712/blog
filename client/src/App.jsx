import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Home from './pages/Home/Home';
import PostDetail from './pages/PostDetail/PostDetail';
import MyProfile from './pages/MyProfile/MyProfile';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';
import Posts from './pages/Dashboard/Posts/Posts';
import EditPost from './pages/Dashboard/Posts/EditPost/EditPost';
import Users from './pages/Dashboard/Users/Users';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />}>
              <Route path='posts' element={<Posts />} />
              <Route path='posts/edit/:postId' element={<EditPost />} />
              <Route path='users' element={<Users />} />
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
