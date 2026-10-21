import { useState } from 'react'
import Logo from '../components/Logo'

export default function Auth({ onAuth }) {
  const [modo, setModo] = useState('login') // 'login' | 'cadastro'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !senha) { setErro('Preencha email e senha.'); return }
    setLoading(true)
    setErro('')
    const { error } = await onAuth(email, senha, modo)
    if (error) setErro(error.message)
    setLoading(false)
  }

  return (
    <div className="screen">
      <Logo sub="6 dias · 1 descanso · 60 dias" />

      <div className="hero">
        <div className="hero-eyebrow">Transformação com propósito</div>
        <div className="hero-title">
          {modo === 'login' ? 'Bem-vindo de volta.' : 'Comece sua jornada.'}
        </div>
        <div className="hero-sub">
          {modo === 'login'
            ? 'Continue de onde parou. Seu protocolo te espera.'
            : 'Para quem está pronto para parar de viver abaixo do próprio potencial.'}
        </div>
      </div>

      <div className="card mb-lg">
        <div className="section-label mb-sm">
          {modo === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
        </div>

        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--texto-medio)', display: 'block', marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          style={{
            width: '100%', border: 'none', borderBottom: '2px solid var(--bege-border)',
            background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 16,
            color: 'var(--texto)', padding: '6px 0 10px', outline: 'none', marginBottom: '1.25rem'
          }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--texto-medio)', display: 'block', marginBottom: 6 }}>
          Senha
        </label>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="••••••••"
          style={{
            width: '100%', border: 'none', borderBottom: '2px solid var(--bege-border)',
            background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 16,
            color: 'var(--texto)', padding: '6px 0 10px', outline: 'none', marginBottom: '0.5rem'
          }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {erro && (
          <div style={{ fontSize: 13, color: '#e07a6a', marginTop: 8, marginBottom: 4 }}>{erro}</div>
        )}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar →' : 'Criar conta →'}
      </button>

      <button
        className="btn btn-ghost"
        onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro('') }}
      >
        {modo === 'login' ? 'Não tenho conta — criar agora' : 'Já tenho conta — fazer login'}
      </button>
    </div>
  )
}
