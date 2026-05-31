import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/home.jsx'
import NoPage from './Pages/noPage.jsx'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App


