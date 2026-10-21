import { useEffect, useRef } from 'react'
import { AREAS } from '../lib/habitos'

export default function Radar({ scores, width = 260, height = 240 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    const R = Math.min(W, H) / 2 - 34
    const N = AREAS.length

    ctx.clearRect(0, 0, W, H)

    // Grid rings
    for (let r = 2; r <= 10; r += 2) {
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * Math.PI * 2 - Math.PI / 2
        const x = cx + (R * r / 10) * Math.cos(ang)
        const y = cy + (R * r / 10) * Math.sin(ang)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = r === 6 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)'
      ctx.lineWidth = r === 6 ? 1 : 0.5
      ctx.stroke()
    }

    // Spokes
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + R * Math.cos(ang), cy + R * Math.sin(ang))
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Data polygon
    ctx.beginPath()
    let first = true
    AREAS.forEach((a, i) => {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2
      const val = scores[a.id] ?? 5
      const r = (val / 10) * R
      const x = cx + r * Math.cos(ang)
      const y = cy + r * Math.sin(ang)
      first ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      first = false
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(79,168,71,0.18)'
    ctx.fill()
    ctx.strokeStyle = '#4fa847'
    ctx.lineWidth = 2
    ctx.stroke()

    // Dots + labels
    AREAS.forEach((a, i) => {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2
      const val = scores[a.id] ?? 5
      const r = (val / 10) * R
      const x = cx + r * Math.cos(ang)
      const y = cy + r * Math.sin(ang)

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#4fa847'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#091009'
      ctx.fill()

      const lr = R + 20
      const lx = cx + lr * Math.cos(ang)
      const ly = cy + lr * Math.sin(ang)
      ctx.font = '600 9px Inter, sans-serif'
      ctx.fillStyle = 'rgba(228,237,228,0.6)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(a.label.toUpperCase(), lx, ly)
    })
  }, [scores])

  return (
    <div className="radar-wrap">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  )
}
