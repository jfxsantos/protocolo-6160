import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { FRASES } from '../lib/habitos'
import { supabase } from '../lib/supabase'

export default function Home({ user }) {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [frase] = useState(FRASES[Math.floor(Math.random() * FRASES.length)])

  useEffect(() => {
    fetchPerfil()
  }, [user])

  const fetchPerfil = async () => {
    const { data } = await supabase.from('perfis').select('*').eq('user_id', user.id).single()
    setPerfil(data)
    setLoading(false)
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
  const diaAtual = perfil?.dia_atual ?? 1
  const sequencia = perfil?.sequencia ?? 0
  const restam = 60 - diaAtual + 1

  const isRestDay = diaAtual % 7 === 0
  const todayDone = perfil?.ultimo_checkin_dia === diaAtual

  if (loading) return <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ color: 'var(--texto-medio)' }}>Carregando...</p>
  </div>

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Logo sub="6 dias · 1 descanso · 60 dias" />
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--verde)' }}>Dia {diaAtual}</div>
      </div>

      {/* CTA CHECK-IN */}
      {todayDone ? (
        <div style={{
          background: 'var(--verde-bg)', border: '1.5px solid var(--verde-claro)',
          borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ width: 38, height: 38, background: 'var(--verde)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#091009', fontSize: 16, flexShrink: 0 }}>✓</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--verde-escuro)' }}>Check-in do Dia {diaAtual} concluído</div>
            <div style={{ fontSize: 12, color: 'var(--texto-medio)', marginTop: 2 }}>Você apareceu hoje. Volte amanhã.</div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => navigate(isRestDay ? '/descanso' : '/checkin')}
          style={{
            background: 'var(--verde)', borderRadius: 6, padding: '1.25rem',
            marginBottom: '1.5rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14, transition: 'background 0.2s'
          }}
        >
          <div style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.13)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            {isRestDay ? '🌿' : '✦'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
              Dia {diaAtual} · Semana {Math.ceil(diaAtual / 7)}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', color: 'var(--texto)', marginBottom: 2 }}>
              {isRestDay ? 'Descanso intencional' : 'Fazer check-in de hoje'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {isRestDay ? 'Hoje é seu dia de pausa ativa' : 'Marque seus hábitos e confirme presença'}
            </div>
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.35)' }}>›</div>
        </div>
      )}

      {/* STATS */}
      <div className="stats-row">
        <div className="stat"><div className="stat-num">{diaAtual}</div><div className="stat-label">Dia atual</div></div>
        <div className="stat"><div className="stat-num">{sequencia}</div><div className="stat-label">Sequência</div></div>
        <div className="stat"><div className="stat-num">{Math.max(0, restam)}</div><div className="stat-label">Restam</div></div>
      </div>

      {/* FRASE */}
      <div className="quote-card mb-lg">
        <div className="quote-text">"{frase}"</div>
        <div className="quote-src">Protocolo 6160</div>
      </div>

      {/* MÓDULOS */}
      <div className="section-label">Módulos</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
        {[
          { icon: '📅', title: 'Trilha', sub: '60 dias de ação', path: '/trilha', status: `Dia ${diaAtual}/60` },
          { icon: '🧭', title: 'Diagnóstico', sub: 'Avalie suas 6 áreas', path: '/diagnostico', status: 'Disponível' },
          { icon: '📈', title: 'Evolução', sub: 'Seu progresso', path: '/evolucao', status: 'Atualizado' },
          { icon: '🌱', title: 'Identidade', sub: 'Quem você está se tornando', path: '/identidade', status: '1 versão' },
        ].map(m => (
          <div
            key={m.path}
            onClick={() => navigate(m.path)}
            style={{
              background: 'var(--bege-card)', border: '1px solid var(--bege-border)',
              borderRadius: 6, padding: '1rem', cursor: 'pointer', transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--verde)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bege-border)'}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--texto)', marginBottom: 3 }}>{m.title}</div>
            <div style={{ fontSize: 11, color: 'var(--texto-medio)', lineHeight: 1.4, marginBottom: 6 }}>{m.sub}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--verde)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
