import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MapPage from './pages/MapPage'
import DashboardPage from './pages/DashboardPage'
import CompetitorsPage from './pages/CompetitorsPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ChurnPage from './pages/ChurnPage'

const pages = {
  map: MapPage,
  dashboard: DashboardPage,
  competitors: CompetitorsPage,
  recommendations: RecommendationsPage,
  churn: ChurnPage,
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('map')
  const Page = pages[currentPage]

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-hidden">
        <Page />
      </main>
    </div>
  )
}
