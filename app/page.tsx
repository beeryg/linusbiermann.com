'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

function ScratchOff() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initCanvas = () => {
      // Set canvas size to match the domain name element exactly
      // The container is inside lotteryTicket, and domainName is a sibling
      const lotteryTicket = container.parentElement
      const domainElement = lotteryTicket?.querySelector('span') as HTMLElement
      
      if (domainElement) {
        // Match domain name dimensions exactly
        const domainRect = domainElement.getBoundingClientRect()
        canvas.width = domainRect.width
        canvas.height = domainRect.height
        // Update container to match
        container.style.width = domainRect.width + 'px'
        container.style.height = domainRect.height + 'px'
      } else {
        // Fallback to container size
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }

      // Create lottery ticket scratch-off pattern (RED)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#d32f2f')
      gradient.addColorStop(0.5, '#e53935')
      gradient.addColorStop(1, '#c62828')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add texture pattern
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        ctx.fillRect(x, y, 2, 2)
      }

      // Add "SCRATCH HERE" text (white for visibility on red)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      const fontSize = Math.max(12, Math.min(16, canvas.width * 0.03))
      ctx.font = `bold ${fontSize}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2)
    }

    initCanvas()
    
    // Handle window resize
    const handleResize = () => {
      if (!isRevealed) {
        initCanvas()
      }
    }
    
    window.addEventListener('resize', handleResize)

    let isDrawing = false

    const getEventPos = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      let clientX: number, clientY: number
      if ('touches' in e) {
        if (e.touches.length === 0) return null
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      }
    }

    // Create angular fingernail-like scratch
    const scratchLine = (x1: number, y1: number, x2: number, y2: number) => {
      if (!ctx || isRevealed) return
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'miter'
      ctx.lineWidth = 15
      
      // Draw main line
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      
      // Add angular variations to simulate fingernail scratching
      const dx = x2 - x1
      const dy = y2 - y1
      const distance = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(3, Math.floor(distance / 8))
      
      for (let i = 0; i < steps; i++) {
        const t = i / steps
        const x = x1 + dx * t
        const y = y1 + dy * t
        
        // Add small angular scratches perpendicular to the main line
        const angle = Math.atan2(dy, dx) + Math.PI / 2
        const offset = (Math.random() - 0.5) * 8
        const scratchX = x + Math.cos(angle) * offset
        const scratchY = y + Math.sin(angle) * offset
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(scratchX, scratchY)
        ctx.stroke()
      }
    }

    const scratch = (x: number, y: number, isFirst: boolean = false) => {
      if (!ctx || isRevealed) return
      
      // Validate coordinates are within canvas bounds
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        return
      }
      
      const lastPos = lastPosRef.current
      
      if (isFirst || !lastPos) {
        // First point - just draw a small mark
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
        lastPosRef.current = { x, y }
      } else {
        // Validate last position too
        if (lastPos.x >= 0 && lastPos.x <= canvas.width && 
            lastPos.y >= 0 && lastPos.y <= canvas.height) {
          // Draw line from last position to current position
          scratchLine(lastPos.x, lastPos.y, x, y)
        }
        lastPosRef.current = { x, y }
      }
      
      // Only check reveal percentage very occasionally and only after significant scratching
      if (!isFirst && Math.random() < 0.02) { // Reduced to 2% chance
        // Use a more accurate sampling method
        const sampleWidth = Math.floor(canvas.width / 20)
        const sampleHeight = Math.floor(canvas.height / 20)
        let transparentPixels = 0
        let totalSamples = 0
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        
        // Sample in a grid pattern for better accuracy
        for (let y = 0; y < canvas.height; y += sampleHeight) {
          for (let x = 0; x < canvas.width; x += sampleWidth) {
            totalSamples++
            const index = (y * canvas.width + x) * 4
            if (index < pixels.length && pixels[index + 3] < 50) { // Check alpha channel
              transparentPixels++
            }
          }
        }
        
        if (totalSamples > 0) {
          const percentage = (transparentPixels / totalSamples) * 100
          
          // Only reveal if actually scratched enough (70% threshold - more strict)
          if (percentage > 70 && !isRevealed) {
            setIsRevealed(true)
            canvas.style.opacity = '0'
            canvas.style.transition = 'opacity 0.5s ease-out'
          }
        }
      }
    }

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      const pos = getEventPos(e)
      if (!pos) return
      
      // Validate coordinates are within canvas bounds (using canvas dimensions)
      if (pos.x < 0 || pos.x > canvas.width || pos.y < 0 || pos.y > canvas.height) {
        return
      }
      
      isDrawing = true
      setIsScratching(true)
      lastPosRef.current = null // Reset position
      scratch(pos.x, pos.y, true)
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || isRevealed) return
      e.preventDefault()
      e.stopPropagation()
      
      const pos = getEventPos(e)
      if (!pos) return
      
      // Validate coordinates are within canvas bounds (using canvas dimensions)
      if (pos.x < 0 || pos.x > canvas.width || pos.y < 0 || pos.y > canvas.height) {
        // If outside bounds, stop drawing but don't reset lastPos to allow re-entry
        return
      }
      
      scratch(pos.x, pos.y, false)
    }

    const handleEnd = () => {
      isDrawing = false
      setIsScratching(false)
      lastPosRef.current = null
    }

    // Mouse events
    canvas.addEventListener('mousedown', handleStart)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseup', handleEnd)
    canvas.addEventListener('mouseleave', handleEnd)

    // Touch events
    canvas.addEventListener('touchstart', handleStart)
    canvas.addEventListener('touchmove', handleMove)
    canvas.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousedown', handleStart)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseup', handleEnd)
      canvas.removeEventListener('mouseleave', handleEnd)
      canvas.removeEventListener('touchstart', handleStart)
      canvas.removeEventListener('touchmove', handleMove)
      canvas.removeEventListener('touchend', handleEnd)
    }
  }, [isRevealed])

  return (
    <div ref={containerRef} className={styles.scratchContainer}>
      <canvas
        ref={canvasRef}
        className={styles.scratchCanvas}
        style={{ cursor: isScratching ? 'grabbing' : 'grab' }}
      />
    </div>
  )
}

export default function Home() {
  useEffect(() => {
    // Create snowflakes
    const createSnowflake = () => {
      const snowflake = document.createElement('div')
      snowflake.className = 'snowflake'
      snowflake.innerHTML = '❄'
      snowflake.style.left = Math.random() * 100 + '%'
      snowflake.style.animationDuration = (Math.random() * 3 + 7) + 's'
      snowflake.style.opacity = Math.random().toString()
      document.body.appendChild(snowflake)

      setTimeout(() => {
        snowflake.remove()
      }, 10000)
    }

    // Create initial snowflakes to fill the screen
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createSnowflake(), i * 200)
    }

    // Create more snowflakes continuously at a faster rate
    const snowflakeInterval = setInterval(createSnowflake, 150)

    return () => {
      clearInterval(snowflakeInterval)
    }
  }, [])

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Merry Christmas, Linus!</h1>
        <div className={styles.giftBox}>
          <div className={styles.giftTitle}>Your Christmas Gift</div>
          <div className={styles.gifContainer}>
          <img 
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2UxamlnZTE4YzBjZnY4aW1vcTB5dHk0dW42c2FrejZ1ZTJ6bnp2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j462yjLHFcqxm7ZT9S/giphy.gif" 
            alt="Christmas animation"
            className={styles.gif}
          />
        </div>
          <div className={styles.domain}>
            <div className={styles.lotteryTicket}>
              <span className={styles.domainName}>linusbiermann.com</span>
              <ScratchOff />
            </div>
          </div>
          <p className={styles.giftMessage}>
            This is yours! 🎁
          </p>
        </div>
        <div className={styles.footer}>
          <p>With love this Christmas ❤️</p>
        </div>
      </div>
    </main>
  )
}

