import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import PostDetail from './pages/PostDetail/PostDetail'
import { AuthProvider } from './contexts/AuthContext'
import MyProfile from './pages/MyProfile/MyProfile';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/post/:slug' element={<PostDetail />} />
            <Route path='/my-profile' element={< MyProfile/>} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
