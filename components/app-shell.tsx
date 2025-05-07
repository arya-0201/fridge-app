"use client"

import { useState, useEffect } from 'react'

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [appHeight, setAppHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
      setAppHeight(window.innerHeight)
    }
    
    // Initial height
    updateHeight()
    
    // Update on resize
    window.addEventListener('resize', updateHeight)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div style={{ height: `${appHeight}px` }}>
      {children}
    </div>
  )
} 