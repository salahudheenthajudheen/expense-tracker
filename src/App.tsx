import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Savings } from './pages/Savings'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/savings" element={<Savings />} />
      </Routes>
    </MainLayout>
  )
}

export default App
