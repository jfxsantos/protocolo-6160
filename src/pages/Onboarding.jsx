import { useState } from 'react'
import Logo from '../components/Logo'
import Radar from '../components/Radar'
import { AREAS, getFase } from '../lib/habitos'
import { supabase } from '../lib/supabase'

const TOTAL_STEPS = 6

export default function Onboarding({ userId, onComplete }) {
  const [step, setStep] = useState(1)
  const [nome, setNome] = useState('')
  const [motivo, setMotivo] = useState('')
  const [assinado, setAssinado] = useState(false)
  const [scores, setScores] = useState(() => Object.fromEntries(AREAS.map(a => [a.id, 5])))
  const [qScores, setQScores] = useState(() => Object.fromEntries(AREAS.map(a => [a.id, [5,5,5]])))
  const [diagIdx, setDiagIdx] = useState(0)
  const [interacted, setInteracted] = useState({})
  const [habitosSelecionados, setHabitosSelecionados] = useState(() => Object.fromEntries(AREAS.map(a => [a.id, []])))
  const [habitosCustom, setHabitosCustom] = useState(() => Object.fromEntries(AREAS.map(a => [a.id, []])))
  const [focusAreas, setFocusAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [areaAtiva, setAreaAtiva] = useState(0)

  const progressPct = Math.round(((step - 1) / TOTAL_STEPS) * 100)

  const getFocusAreas = () => {
    return [...AREAS].sort((a, b) => scores[a.id] - scores[b.id]).slice(0, 2)
  }

  const handleDiagSlide = (areaIdx, qIdx, val) => {
    const area = AREAS[areaIdx]
    const newQ = [...qScores[area.id]]
    newQ[qIdx] = val
    setQScores(prev => ({ ...prev, [area.id]: newQ }))
    setInteracted(prev => ({ ...prev, [area.id]: true }))
    const avg = Math.round((newQ[0] + newQ[1] + newQ[2]) / 3)
    setScores(prev => ({ ...prev, [area.id]: avg }))
  }

  const toggleHabito = (areaId, habitoId) => {
    setHabitosSelecionados(prev => {
      const curr = prev[areaId]
      const total = curr.length + habitosCustom[areaId].length
      if (curr.includes(habitoId)) return { ...prev, [areaId]: curr.filter(h => h !== habitoId) }
      if (total >= 3) return prev
      return { ...prev, [areaId]: [...curr, habitoId] }
    })
  }

  const goToHabitos = () => {
    const focus = getFocusAreas()
    setFocusAreas(focus)
    setStep(5)
  }

  const handleFinish = async () => {
    setLoading(true)
    const focus = focusAreas.map(a => a.id)

    // Salvar perfil
    await supabase.from('perfis').upsert({
      user_id: userId,
      nome,
      motivo,
      dia_atual: 1,
      data_inicio: new Date().toISOString(),
      focus_areas: focus,
      habitos_escolhidos: habitosSelecionados,
      habitos_custom: habitosCustom,
      onboarding_completo: true
    })

    // Salvar diagnóstico inicial
    await supabase.from('diagnosticos').insert({
      user_id: userId,
      scores,
      focus_areas: focus,
      dia: 1
    })

    setLoading(false)
    onComplete()
  }

  const steps = [
    // STEP 1: NOME
    () => (
      <>
        <div className="onb-progress">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`onb-step ${s < step ? 'done' : s === step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: '0.6rem' }}>
          Passo 1 de 6
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 6 }}>Antes de começar,<br />como você se chama?</h2>
        <p style={{ fontSize: 14, color: 'var(--texto-medio)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Vamos te chamar pelo nome durante toda a jornada.
        </p>
        <label className="section-label">Seu nome</label>
        <input
          className="input-text"
          type="text"
          placeholder="Digite seu nome..."
          value={nome}
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && nome.trim().length >= 2 && setStep(2)}
          autoFocus
        />
        <button className="btn btn-primary" onClick={() => setStep(2)} disabled={nome.trim().length < 2}>
          Continuar →
        </button>
      </>
    ),

    // STEP 2: MOTIVO
    () => (
      <>
        <div className="onb-progress">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`onb-step ${s < step ? 'done' : s === step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: '0.6rem' }}>
          Passo 2 de 6
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 6 }}>
          Uma pergunta,<br /><em>{nome}.</em>
        </h2>
        <p style={{ fontSize: 14, color: 'var(--texto-medio)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Seja honesto. Não existe resposta certa — existe a sua.
        </p>

        <div className="quote-card mb-lg">
          <div className="quote-text">"A maioria das pessoas não está com preguiça — está perdida. Quando você sabe para onde vai, a energia aparece."</div>
        </div>

        <label className="section-label">O que te trouxe até aqui?</label>
        <textarea
          className="textarea"
          placeholder="Sinto que estou vivendo abaixo do que poderia..."
          value={motivo}
          onChange={e => setMotivo(e.target.value)}
          rows={3}
          style={{ marginBottom: '1.75rem' }}
        />
        <button className="btn btn-primary" onClick={() => setStep(3)} disabled={motivo.trim().length < 5}>
          Continuar →
        </button>
        <button className="btn btn-ghost" onClick={() => setStep(3)}>Prefiro não responder agora</button>
      </>
    ),

    // STEP 3: COMPROMISSO
    () => (
      <>
        <div className="onb-progress">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`onb-step ${s < step ? 'done' : s === step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: '0.6rem' }}>
          Passo 3 de 6
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 6 }}>O protocolo.</h2>
        <p style={{ fontSize: 14, color: 'var(--texto-medio)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          Simples na estrutura. Exigente na execução.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginBottom: '1.75rem' }}>
          {[['6', 'dias de ação'], ['1', 'dia intencional'], ['60', 'dias de hábito']].map(([n, l]) => (
            <div key={n} className="card" style={{ textAlign: 'center', padding: '1rem 0.5rem', marginBottom: 0 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600, color: 'var(--verde)', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, color: 'var(--texto-medio)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="card card-accent mb-lg">
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', lineHeight: 1.9, color: 'var(--texto)' }}>
            Reconheço que tenho vivido aquém do que sou capaz.<br />
            Hoje escolho construir minha identidade —<br />
            com presença, com disciplina, com esperança.<br /><br />
            Não busco perfeição. Busco consistência.<br />
            Seis dias de ação. Um dia de presença plena.<br />
            Por sessenta dias. A partir de agora.
          </p>
          {nome && (
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontStyle: 'italic', color: 'var(--verde)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--bege-border)' }}>
              — {nome}
            </p>
          )}
        </div>

        <div
          onClick={() => setAssinado(a => !a)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '17px 16px',
            border: `2px solid ${assinado ? 'var(--verde)' : 'var(--bege-border)'}`,
            background: assinado ? 'var(--verde)' : 'var(--bege-card)',
            borderRadius: 6, cursor: 'pointer', marginBottom: 8, transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            border: `2px solid ${assinado ? 'var(--verde)' : 'var(--bege-border)'}`,
            background: assinado ? 'var(--verde)' : 'var(--bege)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: assinado ? '#091009' : 'transparent', flexShrink: 0, transition: 'all 0.2s'
          }}>✓</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: assinado ? 'var(--verde-escuro)' : 'var(--texto)', marginBottom: 2 }}>
              {assinado ? 'Compromisso assumido ✓' : 'Assumo este compromisso'}
            </div>
            <div style={{ fontSize: 12, color: assinado ? 'var(--verde)' : 'var(--texto-fraco)' }}>
              {assinado ? `${nome} — Dia 1` : 'Toque para assinar sua declaração'}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!assinado}>
          Iniciar meu protocolo →
        </button>
      </>
    ),

    // STEP 4: DIAGNÓSTICO
    () => {
      const area = AREAS[diagIdx]
      const avg = Math.round(qScores[area.id].reduce((a,b) => a+b, 0) / 3)
      const answered = AREAS.reduce((acc, a) => acc + (interacted[a.id] ? qScores[a.id].filter(v => v !== 5).length : 0), 0)
      const pct = Math.round(answered / 18 * 100)
      const isLast = diagIdx === AREAS.length - 1

      return (
        <>
          <div className="onb-progress">
            {[1,2,3,4,5,6].map(s => (
              <div key={s} className={`onb-step ${s < step ? 'done' : s === step ? 'active' : ''}`} />
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: 4 }}>
            Passo 4 de 6 · Área {diagIdx + 1} de 6
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 4 }}>Diagnóstico da Vida</h2>
          <p style={{ fontSize: 13, color: 'var(--texto-medio)', marginBottom: '1.25rem' }}>Onde você está hoje — honestamente.</p>

          <Radar scores={scores} />

          <div className="mb-md">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--texto-medio)', marginBottom: 6 }}>
              <span>{answered} de 18 perguntas</span>
              <span style={{ fontWeight: 700, color: 'var(--verde)' }}>{pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="area-dots">
            {AREAS.map((a, i) => (
              <div
                key={a.id}
                className={`dot ${i === diagIdx ? 'active' : interacted[a.id] ? 'done' : ''}`}
                onClick={() => setDiagIdx(i)}
              />
            ))}
          </div>

          <div className="area-block">
            <div className="area-block-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="area-icon" style={{ background: area.color }}>{area.icon}</div>
                <div>
                  <div className="area-name">{area.label}</div>
                </div>
              </div>
              <div className="score-pill" style={{ minWidth: 36, height: 36, fontSize: 18 }}>{avg}</div>
            </div>
            {area.qs.map((q, qi) => (
              <div key={qi} style={{ padding: '12px 14px', borderBottom: qi < 2 ? '1px solid var(--bege-border)' : 'none' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--texto-fraco)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>
                  Pergunta {qi + 1} de 3
                </div>
                <div style={{ fontSize: 15, color: 'var(--texto)', lineHeight: 1.5, marginBottom: 14 }}>{q}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      className="slider"
                      type="range" min="1" max="10" step="1"
                      value={qScores[area.id][qi]}
                      onChange={e => handleDiagSlide(diagIdx, qi, parseInt(e.target.value))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--texto-fraco)', marginTop: 4 }}>
                      <span>1 — Muito baixo</span><span>10 — Excelente</span>
                    </div>
                  </div>
                  <div className="score-pill" style={{ minWidth: 44, height: 44, fontSize: 20 }}>
                    {qScores[area.id][qi]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => diagIdx > 0 && setDiagIdx(diagIdx - 1)} disabled={diagIdx === 0}>
              ← Anterior
            </button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => isLast ? goToHabitos() : setDiagIdx(diagIdx + 1)}>
              {isLast ? 'Ver resultado →' : 'Próxima área →'}
            </button>
          </div>
        </>
      )
    },

    // STEP 5: ESCOLHA DE HÁBITOS
    () => {
      const areaFoco = focusAreas[areaAtiva]
      if (!areaFoco) return null
      const fase = getFase(1)
      const habitos = areaFoco.habitos[fase]
      const selecionados = habitosSelecionados[areaFoco.id]
      const total = selecionados.length + habitosCustom[areaFoco.id].length

      return (
        <>
          <div className="onb-progress">
            {[1,2,3,4,5,6].map(s => (
              <div key={s} className={`onb-step ${s < step ? 'done' : s === step ? 'active' : ''}`} />
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: 6 }}>
            Passo 5 de 6 · Escolha seus hábitos
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 5 }}>Escolha o que<br />cabe na sua vida.</h2>
          <p style={{ fontSize: 13, color: 'var(--texto-medio)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Sugerimos, você decide. Até 3 hábitos por área de foco.
          </p>

          {focusAreas.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
              {focusAreas.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setAreaAtiva(i)}
                  style={{
                    padding: '7px 12px',
                    border: `1.5px solid ${i === areaAtiva ? 'var(--verde)' : 'var(--bege-border)'}`,
                    background: i === areaAtiva ? 'var(--verde)' : 'var(--bege-card)',
                    color: i === areaAtiva ? '#091009' : 'var(--texto-medio)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', borderRadius: 3,
                    display: 'flex', alignItems: 'center', gap: 5
                  }}
                >
                  {a.icon} {a.label}
                  {(habitosSelecionados[a.id].length + habitosCustom[a.id].length) > 0 && (
                    <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {habitosSelecionados[a.id].length + habitosCustom[a.id].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="area-block">
            <div className="area-block-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="area-icon" style={{ background: areaFoco.color }}>{areaFoco.icon}</div>
                <div>
                  <div className="area-name">{areaFoco.label}</div>
                  <div className="area-phase">Fundação · Dias 1–20 · Escolha até 3</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--verde)' }}>
                {total}<span style={{ fontSize: 12, color: 'var(--texto-fraco)' }}>/3</span>
              </div>
            </div>

            {habitos.map(h => {
              const sel = selecionados.includes(h.id)
              const disabled = !sel && total >= 3
              return (
                <div
                  key={h.id}
                  className={`habit-item ${sel ? 'checked' : ''} ${disabled ? '' : ''}`}
                  onClick={() => !disabled && toggleHabito(areaFoco.id, h.id)}
                  style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  <div className="h-check">{sel ? '✓' : ''}</div>
                  <div className="h-text">{h.texto}</div>
                </div>
              )
            })}

            <div style={{ borderTop: '1px solid var(--bege-border)', padding: '12px 14px' }}>
              <div style={{ fontSize: 13, color: 'var(--texto-medio)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>+</span> Adicionar hábito da minha rotina
              </div>
              <textarea
                className="textarea"
                placeholder="Descreva um hábito que já faz parte da sua vida..."
                rows={1}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault()
                    const val = e.target.value.trim()
                    const curr = habitosCustom[areaFoco.id]
                    if (curr.length + selecionados.length < 3) {
                      setHabitosCustom(prev => ({ ...prev, [areaFoco.id]: [...curr, val] }))
                      e.target.value = ''
                    }
                  }
                }}
              />
              <div style={{ fontSize: 10, color: 'var(--texto-fraco)', marginTop: 4 }}>Pressione Enter para adicionar</div>
              {habitosCustom[areaFoco.id].map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div className="h-check checked" style={{ background: 'var(--verde)', borderColor: 'var(--verde)', color: '#091009' }}>✓</div>
                  <div style={{ flex: 1, fontSize: 14, color: 'var(--texto)' }}>{h}</div>
                  <button
                    onClick={() => setHabitosCustom(prev => ({ ...prev, [areaFoco.id]: prev[areaFoco.id].filter((_, j) => j !== i) }))}
                    style={{ background: 'none', border: 'none', color: 'var(--texto-fraco)', cursor: 'pointer', fontSize: 12 }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setStep(6)}>
            Ver resumo →
          </button>
        </>
      )
    },

    // STEP 6: RESUMO + ATIVAÇÃO
    () => (
      <>
        <div className="onb-progress">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`onb-step ${s < step ? 'done' : s === step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: 6 }}>
          Passo 6 de 6
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 5 }}>
          Tudo pronto,<br /><em>{nome}.</em>
        </h2>
        <p style={{ fontSize: 14, color: 'var(--texto-medio)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          Seu protocolo foi configurado. Veja o que te espera.
        </p>

        <div className="card mb-sm">
          <div className="section-label mb-sm">Suas áreas de foco</div>
          {focusAreas.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--bege-border)' : 'none' }}>
              <div className="area-icon" style={{ background: a.color, width: 34, height: 34 }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--texto)' }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'var(--verde)', fontWeight: 600 }}>
                  {i === 0 ? 'Foco principal' : 'Foco secundário'} · {scores[a.id]}/10
                </div>
              </div>
            </div>
          ))}
        </div>

        {focusAreas.map(a => {
          const todos = [...(habitosSelecionados[a.id] || []).map(id => a.habitos.fase1.find(h => h.id === id)?.texto).filter(Boolean), ...habitosCustom[a.id]]
          if (!todos.length) return null
          return (
            <div key={a.id} className="card mb-sm">
              <div className="section-label mb-sm">{a.icon} Hábitos — {a.label}</div>
              {todos.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--verde)', flexShrink: 0, marginTop: 5 }} />
                  <div style={{ fontSize: 14, color: 'var(--texto)', lineHeight: 1.4 }}>{t}</div>
                </div>
              ))}
            </div>
          )
        })}

        <div style={{ background: 'var(--verde-bg)', border: '1.5px dashed var(--verde-claro)', borderRadius: 4, padding: '10px 14px', marginBottom: '1.5rem', fontSize: 12, color: 'var(--verde-claro)', lineHeight: 1.6 }}>
          🔄 Você pode trocar seus hábitos uma vez por semana, no dia de descanso intencional.
        </div>

        <button className="btn btn-primary" onClick={handleFinish} disabled={loading}>
          {loading ? 'Ativando...' : '🌱 Ativar o Protocolo 6160 →'}
        </button>
        <button className="btn btn-ghost" onClick={() => setStep(5)}>← Ajustar hábitos</button>
      </>
    )
  ]


  return (
    <div className="screen">
      <Logo sub="6 dias · 1 descanso · 60 dias" />
      {steps[step - 1]()}
    </div>
  )
}
