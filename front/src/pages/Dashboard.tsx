import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Agency {
  id: string
  email: string
  plan: string
}

const mockMetrics = {
  sessions: 12480,
  activeUsers: 4231,
  pageViews: 38902,
  bounceRate: 41.2,
}

const mockClients = [
  { name: 'Acme Corp', initials: 'AC', sessions: 3240, bounce: 38, color: 'bg-blue-50 text-blue-700' },
  { name: 'TechLabs', initials: 'TL', sessions: 2810, bounce: 45, color: 'bg-green-50 text-green-700' },
  { name: 'MiniStore', initials: 'MS', sessions: 1920, bounce: 52, color: 'bg-amber-50 text-amber-700' },
]

const mockWeeks = [45, 60, 50, 80, 70, 90, 75, 100]

export default function Dashboard() {
  const navigate = useNavigate()
  const [agency, setAgency] = useState<Agency | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setAgency({ id: payload.agency_id, email: '', plan: payload.plan })
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleConnectGoogle = async () => {
    const token = localStorage.getItem('token')
    const { data } = await axios.get('http://localhost:3000/api/auth/google/connect', {
      headers: { Authorization: `Bearer ${token}` }
    })
    window.location.href = data.url
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-base font-medium text-gray-900">Reportes Automáticos</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
            Plan {agency?.plan ?? '—'}
          </span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Resumen de métricas — últimos 30 días</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Sesiones', value: mockMetrics.sessions.toLocaleString(), change: '↑ 8.2%', up: true },
            { label: 'Usuarios activos', value: mockMetrics.activeUsers.toLocaleString(), change: '↑ 3.1%', up: true },
            { label: 'Páginas vistas', value: mockMetrics.pageViews.toLocaleString(), change: '↑ 12.4%', up: true },
            { label: 'Tasa de rebote', value: `${mockMetrics.bounceRate}%`, change: '↑ 2.1%', up: false },
          ].map((m) => (
            <div key={m.label} className="bg-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{m.label}</p>
              <p className="text-2xl font-medium text-gray-900">{m.value}</p>
              <p className={`text-xs mt-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>{m.change} vs mes anterior</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-900">Sesiones por semana</p>
            <button
              onClick={handleConnectGoogle}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Conectar Google Analytics
            </button>
          </div>
          <div className="flex items-end gap-2 h-24">
            {mockWeeks.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                <span className="text-xs text-gray-400">S{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-4">Clientes</p>
            <div className="flex flex-col gap-3">
              {mockClients.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${c.color}`}>
                    {c.initials}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.sessions.toLocaleString()} sesiones</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-4">Tasa de rebote por cliente</p>
            <div className="flex flex-col gap-3">
              {mockClients.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-20">{c.name}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${c.bounce}%` }} />
                  </div>
                  <span className="text-xs text-gray-900 w-8 text-right">{c.bounce}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}