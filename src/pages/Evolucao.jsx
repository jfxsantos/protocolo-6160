import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AREAS } from '../lib/habitos'
import { supabase } from '../lib/supabase'

function RadarComparativo({ antes, agora }) {
  const S = 260, c = S / 2, R = 88, N = AREAS.length
  const pt = (i, v) => { const a = i / N * Math.PI * 2 - Math.PI / 2; return [c + R * v / 10 * Math.cos(a), c + R * v / 10 * Math.sin(a)] }
  const poly = sc => AREAS.map((a, i) => pt(i, sc[a.id] ?? 0).join(',')).join(' ')
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 300, display: 'block', margin: '0 auto' }}>
      {[2, 4, 6, 8, 10].map(r => <polygon key={r} points={AREAS.map((_, i) => pt(i, r).join(',')).join(' ')} fill="none" stroke="rgba(255,255,255,.07)" />)}
      {AREAS.map((a, i) => {
        const p = pt(i, 10), l = pt(i, 12.4)
        return <g key={a.id}>
          <line x1={c} y1={c} x2={p[0]} y2={p[1]} stroke="rgba(255,255,255,.06)" />
          <text x={l[0]} y={l[1]} fill="rgba(228,237,228,.5)" fontSize="8.5" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">{a.label.toUpperCase()}</text>
        </g>
      })}
      <polygon points={poly(antes)} fill="rgba(228,237,228,.06)" stroke="rgba(228,237,228,.35)" strokeDasharray="4 3" />
      <polygon points={poly(agora)} fill="rgba(79,168,71,.18)" stroke="#4fa847" strokeWidth="1.6" />
      {AREAS.map((a, i) => { const p = pt(i, agora[a.id] ?? 0); return <circle key={a.id} cx={p[0]} cy={p[1]} r="3" fill="#4fa847" /> })}
    </svg>
  )
}

export default function Evolucao({ user }) {
  const navigate = useNavigate()
  const [diags, setDiags] = useState(null)
  const [checkins, setCheckins] = useState([])

  useEffect(() => {
    (async () => {
      const [{ data: d }, { data: c }] = await Promise.all([
        supabase.from('diagnosticos').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('checkins').select('dia_num,apareceu').eq('user_id', user.id),
      ])
      setDiags(d ?? []); setCheckins(c ?? [])
    })()
  }, [user])

  if (!diags) return <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}><p className="text-medio">Carregando...</p></div>

  const antes = diags[0]?.scores ?? {}
  const agora = diags[diags.length - 1]?.scores ?? {}
  const media = sc => { const v = AREAS.map(a => sc[a.id]).filter(x => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0 }
  const temComparacao = diags.length > 1
  const delta = media(agora) - media(antes)
  const diasApareceu = checkins.filter(c => c.apareceu).length

  return (
    <div className="screen">
      <button className="back-link" onClick={() => navigate('/')}>← Início</button>
      <div className="section-label">Dia 1 → hoje</div>
      <div className="title-xl">Sua</div>
      <div className="title-it" style={{ marginBottom: '1.5rem' }}>evolução.</div>

      {!temComparacao && (
        <div className="card card-accent">
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>Sua evolução aparece depois do segundo diagnóstico. Até lá, o que conta é <b>aparecer</b> — você já apareceu <span className="text-verde">{diasApareceu}</span> {diasApareceu === 1 ? 'dia' : 'dias'}.</p>
          <button className="btn btn-secondary mt-md" onClick={() => navigate('/diagnostico')}>Ver diagnóstico</button>
        </div>
      )}

      {temComparacao && (<>
        <div className="card">
          <div className="big-nums">
            <div><div className="big-n" style={{ color: 'var(--texto-fraco)' }}>{media(antes).toFixed(1)}</div><div className="big-l">Dia 1</div></div>
            <div style={{ fontSize: 22, color: 'var(--texto-fraco)' }}>→</div>
            <div><div className="big-n text-verde">{media(agora).toFixed(1)}</div><div className="big-l">Hoje</div></div>
            <div style={{ textAlign: 'right' }}><div className="big-n" style={{ fontSize: 30 }}>{delta >= 0 ? '+' : ''}{delta.toFixed(1)}</div><div className="big-l">pontos</div></div>
          </div>
        </div>
        <div className="section-label mt-md">Radar comparativo</div>
        <RadarComparativo antes={antes} agora={agora} />
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 10, color: 'var(--texto-fraco)', letterSpacing: '.06em', margin: '6px 0 1rem' }}>
          <span>- - Dia 1</span><span className="text-verde">— Hoje</span>
        </div>
        <div className="section-label">Por área</div>
        {AREAS.map(a => {
          const d = (agora[a.id] ?? 0) - (antes[a.id] ?? 0)
          return (
            <div className="ar-row" key={a.id}>
              <div className="ar-top">
                <div className="ar-name">{a.label}</div>
                <div className="ar-sc">{Number(agora[a.id] ?? 0).toFixed(1)}<em>{d >= 0 ? '+' : ''}{d.toFixed(1)}</em></div>
              </div>
              <div className="ar-bar"><i className="b" style={{ width: `${(antes[a.id] ?? 0) * 10}%` }} /><i style={{ width: `${(agora[a.id] ?? 0) * 10}%`, opacity: .9 }} /></div>
            </div>
          )
        })}
      </>)}
      <div style={{ height: 40 }} />
    </div>
  )
}
