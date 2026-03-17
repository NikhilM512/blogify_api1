import { useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import Posts from './components/Posts';

function App() {
  const [count, setCount] = useState(0);
  

  return (
    <>
     <h1>Hello</h1>
     <ToastContainer />
     <Posts></Posts>
    </>
  )
}

export default App
