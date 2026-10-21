import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { supabase } from '../lib/supabase'

export default function Trilha({ user }) {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [checkins, setCheckins] = useState([])

  useEffect(() => {
    Promise.all([
      supabase.from('perfis').select('*').eq('user_id', user.id).single(),
      supabase.from('checkins').select('dia_num').eq('user_id', user.id)
    ]).then(([{ data: p }, { data: c }]) => {
      setPerfil(p)
      setCheckins((c ?? []).map(r => r.dia_num))
    })
  }, [user])

  const diaAtual = perfil?.dia_atual ?? 1
  const isRestDay = d => d % 7 === 0
  const isDone = d => checkins.includes(d)
  const totalWeeks = Math.ceil(60 / 7)
  const curWeek = Math.ceil(diaAtual / 7) - 1

  if (!perfil) return <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--texto-medio)' }}>Carregando...</p></div>

  const ctaDone = checkins.includes(diaAtual)

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Logo sub="Trilha dos 60 dias" />
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--verde)' }}>Dia {diaAtual}</div>
      </div>

      {/* CTA */}
      {ctaDone ? (
        <div style={{ background: 'var(--verde-bg)', border: '1.5px solid var(--verde-claro)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: 'var(--verde)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#091009', fontSize: 16, flexShrink: 0 }}>✓</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--verde-escuro)' }}>Check-in do Dia {diaAtual} concluído</div>
            <div style={{ fontSize: 12, color: 'var(--texto-medio)', marginTop: 2 }}>Você apareceu hoje. Volte amanhã.</div>
          </div>
        </div>
      ) : (
        <div onClick={() => navigate(isRestDay(diaAtual) ? '/descanso' : '/checkin')}
          style={{ background: 'var(--verde)', borderRadius: 6, padding: '1.25rem', marginBottom: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.13)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            {isRestDay(diaAtual) ? '🌿' : '✦'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
              Dia {diaAtual} · Semana {Math.ceil(diaAtual / 7)}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', color: 'var(--texto)', marginBottom: 2 }}>
              {isRestDay(diaAtual) ? 'Descanso intencional' : 'Fazer check-in de hoje'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Toque para marcar seus hábitos</div>
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.35)' }}>›</div>
        </div>
      )}

      <div className="stats-row">
        <div className="stat"><div className="stat-num">{diaAtual}</div><div className="stat-label">Dia atual</div></div>
        <div className="stat"><div className="stat-num">{perfil?.sequencia ?? 0}</div><div className="stat-label">Sequência</div></div>
        <div className="stat"><div className="stat-num">{Math.max(0, 60 - diaAtual + 1)}</div><div className="stat-label">Restam</div></div>
      </div>

      {/* SEMANA ATUAL */}
      <div className="section-label">Semana atual</div>
      {(() => {
        const start = curWeek * 7 + 1
        const end = Math.min(start + 6, 60)
        const done = Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(d => isDone(d) || d < diaAtual).length
        return (
          <div className="week-card current mb-lg">
            <div className="week-header">
              <div className="week-title">Semana {curWeek + 1}</div>
              <div className="week-prog">{done} / 7 dias</div>
            </div>
            <div className="week-days">
              {Array.from({ length: end - start + 1 }, (_, i) => {
                const d = start + i
                const rest = isRestDay(d)
                const done = isDone(d)
                const today = d === diaAtual
                let cls = 'future'
                if (rest && done) cls = 'rest-done'
                else if (rest && today) cls = 'rest'
                else if (rest) cls = 'rest'
                else if (today && done) cls = 'done'
                else if (today) cls = 'today'
                else if (done) cls = 'done'
                return (
                  <div key={d} className="wday" onClick={() => today && navigate(rest ? '/descanso' : '/checkin')} style={{ cursor: today ? 'pointer' : 'default' }}>
                    <div className="wday-num">D{i + 1}</div>
                    <div className={`wday-circle ${cls}`}>{rest ? '↻' : (done || today ? '✓' : d)}</div>
                    <div className={`wday-tag ${rest ? 'rest-tag' : ''}`}>{rest ? 'Desc' : ''}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* PRÓXIMAS SEMANAS */}
      <div className="section-label">Próximas semanas</div>
      {Array.from({ length: Math.min(4, totalWeeks - curWeek - 1) }, (_, i) => {
        const w = curWeek + 1 + i
        const start = w * 7 + 1
        const end = Math.min(start + 6, 60)
        return (
          <div key={w} style={{ background: 'var(--bege-card)', border: '1px solid var(--bege-border)', borderRadius: 4, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--texto-fraco)', minWidth: 70 }}>Semana {w + 1}</div>
            <div style={{ display: 'flex', gap: 3, flex: 1 }}>
              {Array.from({ length: end - start + 1 }, (_, j) => {
                const d = start + j
                return <div key={d} style={{ width: 14, height: 14, borderRadius: 3, background: isRestDay(d) ? 'var(--verde-bg)' : 'var(--bege-border)', border: `1px ${isRestDay(d) ? 'dashed rgba(79,168,71,0.4)' : 'solid var(--bege-border)'}`, flexShrink: 0 }} />
              })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--texto-fraco)' }}>—</div>
          </div>
        )
      })}
    </div>
  )
}
