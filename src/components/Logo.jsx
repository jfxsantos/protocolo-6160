export default function Logo({ sub }) {
  return (
    <div className="logo-bar">
      <div className="logo-mark">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="rgba(9,16,9,0.4)" strokeWidth="0.75"/>
          <circle cx="10" cy="10" r="3" fill="none" stroke="#091009" strokeWidth="1.2"/>
          <circle cx="10" cy="10" r="1" fill="#091009"/>
          <line x1="10" y1="2" x2="10" y2="6.5" stroke="rgba(9,16,9,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <div className="logo-name">Protocolo 6160</div>
        {sub && <div className="logo-sub">{sub}</div>}
      </div>
    </div>
  )
}
