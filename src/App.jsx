import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Trilha from './pages/Trilha'
import Checkin from './pages/Checkin'
import Diagnostico from './pages/Diagnostico'
import Evolucao from './pages/Evolucao'
import { Identidade, Descanso } from './pages/Identidade'

function BottomNav() {
  const location = useLocation()
  const hiddenRoutes = ['/checkin', '/descanso', '/onboarding']
  if (hiddenRoutes.includes(location.pathname)) return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bege-card)', borderTop: '1px solid var(--bege-border)',
      display: 'flex', zIndex: 100, maxWidth: 480, margin: '0 auto'
    }}>
      {[
        { to: '/', icon: '🏠', label: 'Início' },
        { to: '/trilha', icon: '📅', label: 'Trilha' },
        { to: '/checkin', icon: '✦', label: 'Check-in' },
        { to: '/identidade', icon: '🌱', label: 'Identidade' },
      ].map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 4px 14px',
            textDecoration: 'none',
          })}
        >
          {({ isActive }) => (
            <>
              <span style={{ fontSize: 18, marginBottom: 3, transform: isActive ? 'translateY(-2px)' : 'none', transition: 'transform 0.15s' }}>{icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? 'var(--verde)' : 'var(--texto-fraco)', transition: 'color 0.15s' }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function AppContent() {
  const [user, setUser] = useState(null)
  const [onboardingFeito, setOnboardingFeito] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkOnboarding(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkOnboarding(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkOnboarding = async (userId) => {
    const { data } = await supabase.from('perfis').select('onboarding_completo').eq('user_id', userId).single()
    setOnboardingFeito(data?.onboarding_completo ?? false)
    setLoading(false)
  }

  const handleAuth = async (email, senha, modo) => {
    if (modo === 'cadastro') {
      return supabase.auth.signUp({ email, password: senha })
    }
    return supabase.auth.signInWithPassword({ email, password: senha })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bege)' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--texto-medio)' }}>
        Carregando...
      </div>
    </div>
  )

  if (!user) return <Auth onAuth={handleAuth} />
  if (!onboardingFeito) return <Onboarding userId={user.id} onComplete={() => setOnboardingFeito(true)} />

  return (
    <>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/trilha" element={<Trilha user={user} />} />
        <Route path="/checkin" element={<Checkin user={user} />} />
        <Route path="/diagnostico" element={<Diagnostico user={user} />} />
        <Route path="/evolucao" element={<Evolucao user={user} />} />
        <Route path="/identidade" element={<Identidade user={user} />} />
        <Route path="/descanso" element={<Descanso user={user} />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
