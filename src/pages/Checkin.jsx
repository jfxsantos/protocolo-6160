import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { AREAS, getFase, getFaseLabel, FRASES } from '../lib/habitos'
import { supabase } from '../lib/supabase'

export default function Checkin({ user }) {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [appeared, setAppeared] = useState(false)
  const [checked, setChecked] = useState({})
  const [reflexao, setReflexao] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [frase] = useState(FRASES[Math.floor(Math.random() * FRASES.length)])

  useEffect(() => {
    supabase.from('perfis').select('*').eq('user_id', user.id).single()
      .then(({ data }) => setPerfil(data))
  }, [user])

  const diaAtual = perfil?.dia_atual ?? 1
  const fase = getFase(diaAtual)
  const faseLabel = getFaseLabel(diaAtual)
  const focusAreas = (perfil?.focus_areas ?? []).slice(0, 2)
  const habitosEscolhidos = perfil?.habitos_escolhidos ?? {}
  const habitosCustom = perfil?.habitos_custom ?? {}

  const getHabitos = (areaId) => {
    const area = AREAS.find(a => a.id === areaId)
    if (!area) return []
    const ids = habitosEscolhidos[areaId] ?? []
    const selecionados = ids.map(id => area.habitos[fase]?.find(h => h.id === id)).filter(Boolean)
    const custom = (habitosCustom[areaId] ?? []).map((t, i) => ({ id: `custom_${areaId}_${i}`, texto: t }))
    return [...selecionados, ...custom]
  }

  const totalHabitos = focusAreas.reduce((acc, aId) => acc + getHabitos(aId).length, 0)
  const totalChecked = Object.values(checked).filter(Boolean).length
  const progPct = totalHabitos > 0 ? Math.round(totalChecked / totalHabitos * 100) : 0

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const salvar = async () => {
    setSaving(true)
    const habitosFeitos = Object.entries(checked).filter(([, v]) => v).map(([k]) => k)
    await supabase.from('checkins').upsert({
      user_id: user.id,
      dia_num: diaAtual,
      habitos_feitos: habitosFeitos,
      reflexao,
      apareceu: appeared
    })
    await supabase.from('perfis').update({
      dia_atual: diaAtual + 1,
      ultimo_checkin_dia: diaAtual,
      sequencia: (perfil?.sequencia ?? 0) + 1
    }).eq('user_id', user.id)
    setSaving(false)
    setDone(true)
  }

  if (!perfil) return <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--texto-medio)' }}>Carregando...</p></div>

  if (done) return (
    <div className="screen">
      <Logo sub="Dia concluído" />
      <div className="success-hero">
        <div className="success-icon">🌱</div>
        <div className="success-title">Dia {diaAtual} concluído.</div>
        <div className="success-sub">Você apareceu. Você praticou.<br />Isso é identidade em construção.</div>
        <div className="streak-pill">{(perfil?.sequencia ?? 0) + 1} dias consecutivos ✦</div>
      </div>
      <div className="quote-card mb-lg">
        <div className="quote-text">"{frase}"</div>
        <div className="quote-src">Protocolo 6160</div>
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/')}>← Voltar para o início</button>
    </div>
  )

  return (
    <div className="screen">
      <Logo sub={`Check-in · Dia ${diaAtual}`} />

      <div className="hero">
        <div className="hero-eyebrow">Dia {diaAtual} · Semana {Math.ceil(diaAtual / 7)} · {faseLabel}</div>
        <div className="hero-title">Seus hábitos<br />de hoje</div>
        <div className="hero-sub">Foco nas suas 2 áreas prioritárias. Simples assim.</div>
      </div>

      {/* PRESENÇA */}
      <div
        onClick={() => setAppeared(a => !a)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '17px 16px',
          border: `2px solid ${appeared ? 'var(--verde)' : 'var(--bege-border)'}`,
          background: appeared ? 'var(--verde)' : 'var(--bege-card)',
          borderRadius: 6, cursor: 'pointer', marginBottom: '1.5rem', transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          border: `2px solid ${appeared ? 'var(--verde)' : 'var(--bege-border)'}`,
          background: appeared ? 'var(--verde)' : 'var(--bege)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: appeared ? '#091009' : 'transparent', flexShrink: 0, transition: 'all 0.2s'
        }}>✓</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: appeared ? 'var(--verde-escuro)' : 'var(--texto)', marginBottom: 2 }}>
            {appeared ? 'Presença confirmada!' : 'Apareci hoje'}
          </div>
          <div style={{ fontSize: 12, color: appeared ? 'var(--verde)' : 'var(--texto-fraco)' }}>
            {appeared ? 'Agora marque seus hábitos' : 'Confirme sua presença antes de tudo'}
          </div>
        </div>
      </div>

      {/* PROGRESSO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 12, color: 'var(--texto-medio)', fontWeight: 500, whiteSpace: 'nowrap' }}>Hábitos</div>
        <div className="progress-track" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${progPct}%` }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--verde)', minWidth: 32, textAlign: 'right' }}>
          {totalChecked}/{totalHabitos}
        </div>
      </div>

      {/* HÁBITOS POR ÁREA */}
      <div className="section-label">Suas áreas de foco</div>
      {focusAreas.map(areaId => {
        const area = AREAS.find(a => a.id === areaId)
        if (!area) return null
        const habitos = getHabitos(areaId)
        const done = habitos.filter(h => checked[h.id]).length

        return (
          <div key={areaId} className="area-block">
            <div className="area-block-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="area-icon" style={{ background: area.color }}>{area.icon}</div>
                <div>
                  <div className="area-name">{area.label}</div>
                  <div className="area-phase">{faseLabel}</div>
                </div>
              </div>
              <div className="area-prog">{done}/{habitos.length}</div>
            </div>
            {habitos.map(h => (
              <div
                key={h.id}
                className={`habit-item ${checked[h.id] ? 'checked' : ''}`}
                onClick={() => toggle(h.id)}
              >
                <div className="h-check">{checked[h.id] ? '✓' : ''}</div>
                <div className="h-text">{h.texto}</div>
              </div>
            ))}
          </div>
        )
      })}

      {/* REFLEXÃO */}
      <div className="card mb-lg" style={{ marginTop: 4 }}>
        <div className="section-label mb-sm">Reflexão do dia (opcional)</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontStyle: 'italic', color: 'var(--verde)', marginBottom: 8 }}>
          O que esse dia me ensinou sobre quem estou me tornando?
        </div>
        <textarea
          className="textarea"
          rows={2}
          placeholder="Escreva livremente..."
          value={reflexao}
          onChange={e => setReflexao(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={salvar} disabled={!appeared || saving}>
        {saving ? 'Salvando...' : 'Salvar check-in →'}
      </button>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>← Voltar</button>
    </div>
  )
}
