import { GEMINI_API_KEY } from '@env'

const WS_URL =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent'

type VoiceName = 'Puck' | 'Charon' | 'Aoede' | 'Fenrir'

export function createGeminiLiveSocket(opts: {
  personaName: string
  voiceName: VoiceName
  systemText: string
}) {
  const ws = new WebSocket(`${WS_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`)

    ws.onmessage = (e) => {
    console.log('WS data type:', typeof e.data)
    console.log('WS data:', e.data)
    }

  ws.onerror = (e) => {
    console.log('WS error', e)
  }

  ws.onclose = (e) => {
    console.log('WS closed', e.code, e.reason)
  }

  ws.onopen = () => {
    console.log('WS open')

    const setup = {
      setup: {
        // model: 'models/gemini-2.5-flash-live-preview',//Not working giving erros/
        model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
        generation_config: {
          response_modalities: ['AUDIO'],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: { voice_name: opts.voiceName },
            },
          },
        },
        system_instruction: {
          parts: [{ text: opts.systemText.replace('[Persona Name]', opts.personaName) }],
        },
      },
    }

    ws.send(JSON.stringify(setup))

    ws.send(
      JSON.stringify({
        client_content: {
          turns: [{ role: 'user', parts: [{ text: 'Say hello in one short sentence.' }] }],
          turn_complete: true,
        },
      }),
    )
  }

  return ws
}
