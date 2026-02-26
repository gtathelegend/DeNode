import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'

import CreateDecisionPage from './pages/CreateDecisionPage'
import DecisionDetailPage from './pages/DecisionDetailPage'
import DecisionListPage from './pages/DecisionListPage'

function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <h1>DeNode</h1>
        <nav>
          <Link to="/">Decisions</Link>
          <Link to="/decisions/new">Create</Link>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<DecisionListPage />} />
          <Route path="/decisions/new" element={<CreateDecisionPage />} />
          <Route path="/decisions/:id" element={<DecisionDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
