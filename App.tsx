import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { createGeminiLiveSocket } from './src/services/geminiLive'

export default function App() {
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    console.log('App mounted') // lowercase console

    setStatus('connecting')

    const ws = createGeminiLiveSocket({
      personaName: 'CozyFriend',
      voiceName: 'Puck',
      systemText: 'You are [Persona Name], a cozy AI friend...',
    })

    wsRef.current = ws

    ws.addEventListener('open', () => setStatus('open'))
    ws.addEventListener('error', () => setStatus('error'))
    ws.addEventListener('close', () => setStatus('closed'))

    return () => ws.close()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Gemini Live status: {status}</Text>
    </SafeAreaView>
  )
}
