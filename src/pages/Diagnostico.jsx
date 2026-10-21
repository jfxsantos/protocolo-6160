import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AREAS } from '../lib/habitos'
import { supabase } from '../lib/supabase'

const INTERVALO = 14 // dias entre avaliações

export default function Diagnostico({ user }) {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [diags, setDiags] = useState([])
  const [loading, setLoading] = useState(true)
  const [refazendo, setRefazendo] = useState(false)
  const [idx, setIdx] = useState(0)
  const [q, setQ] = useState(() => Object.fromEntries(AREAS.map(a => [a.id, [5, 5, 5]])))
  const [salvando, setSalvando] = useState(false)

  const carregar = async () => {
    const [{ data: p }, { data: d }] = await Promise.all([
      supabase.from('perfis').select('*').eq('user_id', user.id).single(),
      supabase.from('diagnosticos').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    ])
    setPerfil(p); setDiags(d ?? []); setLoading(false)
  }
  useEffect(() => { carregar() }, [user])

  if (loading) return <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}><p className="text-medio">Carregando...</p></div>

  const diaAtual = perfil?.dia_atual ?? 1
  const ultimo = diags[diags.length - 1]
  const proximoDia = (ultimo?.dia ?? 1) + INTERVALO
  const liberado = diaAtual >= proximoDia
  const scores = ultimo?.scores ?? {}
  const foco = perfil?.focus_areas ?? []

  const media = id => q[id].reduce((a, b) => a + b, 0) / 3

  const salvar = async () => {
    setSalvando(true)
    const novos = Object.fromEntries(AREAS.map(a => [a.id, Math.round(media(a.id) * 10) / 10]))
    const menores = [...AREAS].sort((x, y) => novos[x.id] - novos[y.id]).slice(0, 2).map(a => a.id)
    await supabase.from('diagnosticos').insert({ user_id: user.id, scores: novos, focus_areas: menores, dia: diaAtual })
    await carregar()
    setRefazendo(false); setIdx(0); setSalvando(false)
  }

  if (refazendo) {
    const a = AREAS[idx]
    const ultima = idx === AREAS.length - 1
    return (
      <div className="screen">
        <button className="back-link" onClick={() => setRefazendo(false)}>← Cancelar</button>
        <div className="section-label">Área {idx + 1} de {AREAS.length}</div>
        <div className="title-xl">{a.label}</div>
        <div className="title-it" style={{ marginBottom: '1.5rem' }}>como está hoje?</div>
        <div className="area-block">
          {a.qs.map((texto, i) => (
            <div key={i} style={{ padding: '12px 14px', borderBottom: i < 2 ? '1px solid var(--bege-border)' : 'none' }}>
              <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 14 }}>{texto}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input className="slider" type="range" min="1" max="10" step="1" value={q[a.id][i]} style={{ flex: 1 }}
                  onChange={e => setQ(prev => ({ ...prev, [a.id]: prev[a.id].map((v, j) => j === i ? parseInt(e.target.value) : v) }))} />
                <div className="score-pill" style={{ minWidth: 44, height: 44, fontSize: 20 }}>{q[a.id][i]}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} disabled={idx === 0} onClick={() => setIdx(idx - 1)}>←</button>
          <button className="btn btn-primary" style={{ flex: 3 }} disabled={salvando} onClick={() => ultima ? salvar() : setIdx(idx + 1)}>
            {ultima ? (salvando ? 'Salvando...' : 'Salvar diagnóstico') : 'Próxima área →'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <button className="back-link" onClick={() => navigate('/')}>← Início</button>
      <div className="section-label">Diagnóstico da vida · 6 áreas</div>
      <div className="title-xl">Onde você</div>
      <div className="title-it" style={{ marginBottom: '1.5rem' }}>está hoje.</div>

      <div className="card">
        <div className="display" style={{ fontSize: 15 }}>{diags.length > 1 ? `Último diagnóstico · Dia ${ultimo.dia}` : 'Diagnóstico inicial · Dia 1'}</div>
        <p style={{ fontSize: 12, color: 'var(--texto-medio)', lineHeight: 1.6, marginTop: 4 }}>
          {liberado ? 'Já dá para reavaliar. Compare no mesmo ritmo para ver sua evolução real.' : `Próxima avaliação no Dia ${proximoDia} — faltam ${proximoDia - diaAtual} dias.`}
        </p>
        <button className="btn btn-primary mt-md" disabled={!liberado} onClick={() => setRefazendo(true)}>Refazer diagnóstico</button>
      </div>

      <div className="section-label mt-md">Nota atual por área</div>
      {AREAS.map(a => (
        <div className="ar-row" key={a.id}>
          <div className="ar-top">
            <div className="ar-name">{a.label}{foco.includes(a.id) && <span className="ar-badge">Foco</span>}</div>
            <div className="ar-sc">{Number(scores[a.id] ?? 0).toFixed(1)}</div>
          </div>
          <div className="ar-bar"><i style={{ width: `${(scores[a.id] ?? 0) * 10}%` }} /></div>
        </div>
      ))}
      <div style={{ height: 40 }} />
    </div>
  )
}
