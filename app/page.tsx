'use client'

import { useEffect } from 'react'
import styles from './page.module.css'

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

    // Create stars
    const createStar = () => {
      const star = document.createElement('div')
      star.className = 'star'
      star.innerHTML = '✨'
      star.style.left = Math.random() * 100 + '%'
      star.style.top = Math.random() * 100 + '%'
      star.style.animationDelay = Math.random() * 2 + 's'
      document.body.appendChild(star)
    }

    // Create initial snowflakes
    const snowflakeInterval = setInterval(createSnowflake, 300)

    // Create stars
    for (let i = 0; i < 20; i++) {
      createStar()
    }

    return () => {
      clearInterval(snowflakeInterval)
    }
  }, [])

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>🎄 Merry Christmas, Linus! 🎄</h1>
        <p className={styles.message}>
          Wishing you a wonderful holiday season filled with joy, laughter, and happiness!
        </p>
        <div className={styles.giftBox}>
          <div className={styles.giftTitle}>Your Christmas Gift</div>
          <div className={styles.domain}>
            <span className={styles.domainName}>linusbiermann.com</span>
          </div>
          <p className={styles.giftMessage}>
            This domain is yours! 🎁
          </p>
        </div>
        <div className={styles.footer}>
          <p>With love this Christmas ❤️</p>
        </div>
      </div>
    </main>
  )
}

