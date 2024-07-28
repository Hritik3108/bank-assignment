import { Outlet } from 'react-router-dom'
import './App.css'
import TransactionPopUp from './component/transactionPopUp'

function App() {

  return (
    <>
      <TransactionPopUp/>
      <Outlet/>
    </>
  )
}

export default App
