import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import PostDetail from './pages/PostDetail/PostDetail';
import MyProfile from './pages/MyProfile/MyProfile';
import CreatePost from './pages/CreatePost/CreatePost';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/post/:slug' element={<PostDetail />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/create-post' element={<CreatePost  />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
