import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'element={<Home />} />
        <Route path='/login'element={<Login />} />
        <Route path='/sign-up'element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
