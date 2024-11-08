'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import BIRDS from 'vanta/dist/vanta.birds.min'

export default function VantaBackground({ children }: { children: React.ReactNode }) {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!vantaEffect && typeof window !== 'undefined') {
      setVantaEffect(
        BIRDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0xffffff,
          color1: 0xff69b4,
          color2: 0xffb6c1,
          colorMode: "lerp",
          birdSize: 1.50,
          wingSpan: 14.00,
          separation: 50.00,
          alignment: 1.00,
          cohesion: 1.00,
          quantity: 3.00
        })
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div ref={vantaRef} className="min-h-screen">
      {children}
    </div>
  )
}
