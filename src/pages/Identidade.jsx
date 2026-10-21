import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { supabase } from '../lib/supabase'

const GUIAS = [
  { icon: '🧠', texto: 'Que tipo de pessoa você quer ser quando ninguém está olhando?', tag: 'Caráter' },
  { icon: '💪', texto: 'Que hábito define a nova versão de você?', tag: 'Ação' },
  { icon: '🌱', texto: 'O que você quer parar de fazer que contradiz quem está se tornando?', tag: 'Limite' },
  { icon: '🧭', texto: 'Qual valor você quer que guie suas decisões?', tag: 'Valores' },
  { icon: '❤️', texto: 'Como você quer que as pessoas que ama te descrevam?', tag: 'Relações' },
]

export function Identidade({ user }) {
  const navigate = useNavigate()
  const [historico, setHistorico] = useState([])
  const [texto, setTexto] = useState('')
  const [diaAtual, setDiaAtual] = useState(1)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('identidades').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('perfis').select('dia_atual').eq('user_id', user.id).single()
    ]).then(([{ data: ids }, { data: p }]) => {
      setHistorico(ids ?? [])
      setDiaAtual(p?.dia_atual ?? 1)
    })
  }, [user])

  const salvar = async () => {
    if (!texto.trim()) return
    setSalvando(true)
    await supabase.from('identidades').insert({ user_id: user.id, texto: texto.trim(), dia: diaAtual })
    setHistorico(prev => [...prev, { texto: texto.trim(), dia: diaAtual, created_at: new Date().toISOString() }])
    setTexto('')
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <div className="screen">
      <Logo sub="Identidade em Construção" />
      <div className="hero">
        <div className="hero-eyebrow">Dia {diaAtual}</div>
        <div className="hero-title">Quem você está<br />se tornando?</div>
        <div className="hero-sub">Escreva, revise e refine ao longo dos 60 dias.</div>
      </div>

      <div className="section-label">Sua declaração</div>
      <div className="card mb-sm">
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', color: 'var(--verde)', marginBottom: 10 }}>
          Eu sou alguém que...
        </div>
        <textarea
          className="textarea"
          rows={3}
          placeholder="aparece todos os dias, mesmo sem vontade..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
      </div>

      {texto.trim().length > 4 && (
        <div style={{ background: 'var(--verde)', borderRadius: 6, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
            Sua declaração · Dia {diaAtual}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', color: 'var(--texto)', lineHeight: 1.6 }}>
            "Eu sou alguém que {texto}"
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>Protocolo 6160</div>
        </div>
      )}

      <button className="btn btn-primary mb-lg" onClick={salvar} disabled={texto.trim().length < 5 || salvando}>
        {salvando ? 'Salvando...' : salvo ? '✓ Salvo!' : 'Salvar declaração →'}
      </button>

      <div className="section-label">Perguntas para te guiar</div>
      {GUIAS.map((g, i) => (
        <div key={i} onClick={() => document.querySelector('.textarea')?.focus()} style={{ background: 'var(--bege-card)', border: '1px solid var(--bege-border)', borderRadius: 4, padding: '1rem', marginBottom: 8, cursor: 'pointer', display: 'flex', gap: 10 }}>
          <div style={{ fontSize: 16, flexShrink: 0 }}>{g.icon}</div>
          <div>
            <div style={{ fontSize: 14, color: 'var(--texto)', lineHeight: 1.45 }}>{g.texto}</div>
            <div style={{ fontSize: 10, color: 'var(--verde-claro)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>{g.tag}</div>
          </div>
        </div>
      ))}

      {historico.length > 0 && (
        <>
          <div className="section-label mt-lg">Versões anteriores</div>
          {[...historico].reverse().map((h, i) => (
            <div key={i} style={{ background: 'var(--bege-card)', border: '1px solid var(--bege-border)', borderLeft: i === 0 ? '4px solid var(--verde)' : undefined, borderRadius: 4, padding: '1.25rem', marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--texto-fraco)', marginBottom: 5 }}>
                Dia {h.dia} {i === 0 ? '· Mais recente' : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', color: 'var(--texto)', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--verde)' }}>Eu sou alguém que </span>{h.texto}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export function Descanso({ user }) {
  const navigate = useNavigate()
  const [respostas, setRespostas] = useState({ funcionou: '', travou: '', intencao: '' })
  const [salvando, setSalvando] = useState(false)
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    supabase.from('perfis').select('*').eq('user_id', user.id).single().then(({ data }) => setPerfil(data))
  }, [user])

  const semana = Math.ceil((perfil?.dia_atual ?? 1) / 7)

  const salvar = async () => {
    setSalvando(true)
    const diaAtual = perfil?.dia_atual ?? 7
    await supabase.from('checkins').upsert({
      user_id: user.id, dia_num: diaAtual,
      reflexao: JSON.stringify(respostas), apareceu: true, habitos_feitos: []
    })
    await supabase.from('perfis').update({
      dia_atual: diaAtual + 1, ultimo_checkin_dia: diaAtual,
      sequencia: (perfil?.sequencia ?? 0) + 1
    }).eq('user_id', user.id)
    setSalvando(false)
    navigate('/')
  }

  return (
    <div className="screen">
      <Logo sub="Descanso Intencional" />
      <div style={{ background: 'var(--bege-card)', borderLeft: '3px solid var(--verde)', margin: '0 -1.5rem 2rem', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: '1rem' }}>🌿</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontStyle: 'italic', color: 'var(--texto)', marginBottom: '0.5rem' }}>
          Hoje é seu dia<br />de descanso.
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          Não é pausa — é parte do protocolo.<br />Descansar com intenção é uma habilidade.
        </div>
      </div>

      <div className="section-label">Revisão da Semana {semana}</div>
      {[
        { key: 'funcionou', label: 'O que funcionou bem essa semana?', placeholder: 'Escreva livremente...' },
        { key: 'travou', label: 'O que me travou ou tirou do caminho?', placeholder: 'Seja honesto consigo mesmo...' },
        { key: 'intencao', label: 'Qual é minha intenção para a próxima semana?', placeholder: 'Uma coisa, clara e específica...' },
      ].map(({ key, label, placeholder }) => (
        <div key={key} className="card mb-sm">
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--texto-medio)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
          <textarea className="textarea" rows={2} placeholder={placeholder}
            value={respostas[key]} onChange={e => setRespostas(prev => ({ ...prev, [key]: e.target.value }))} />
        </div>
      ))}

      {respostas.intencao.trim().length > 3 && (
        <div style={{ background: 'var(--verde-bg)', border: '1.5px dashed var(--verde-claro)', borderRadius: 4, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--verde)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            Minha intenção para a próxima semana
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', color: 'var(--verde-escuro)', lineHeight: 1.65 }}>
            {respostas.intencao}
          </div>
        </div>
      )}

      <button className="btn btn-primary" onClick={salvar} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Concluir descanso intencional →'}
      </button>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>← Voltar</button>
    </div>
  )
}
