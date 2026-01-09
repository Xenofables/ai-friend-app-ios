import { Platform } from 'react-native'
import AudioSession from 'react-native-audio-session'

type Maybe<T> = T | null

export async function configureAEC(): Promise<void> {
  if (Platform.OS !== 'ios') return

  await AudioSession.setCategoryAndMode('PlayAndRecord', 'VoiceChat', 'DefaultToSpeaker')
  await AudioSession.setActive(true)

  const category = await AudioSession.currentCategory()
  const mode = await AudioSession.currentMode()

  // react-native-audio-session typings vary across forks; keep this safe.
  const anyAudioSession = AudioSession as unknown as {
    currentCategoryOptions?: () => Promise<unknown>
    currentOptions?: () => Promise<unknown>
  }

  let options: Maybe<unknown> = null
  if (anyAudioSession.currentCategoryOptions) options = await anyAudioSession.currentCategoryOptions()
  else if (anyAudioSession.currentOptions) options = await anyAudioSession.currentOptions()

  console.log('[AEC] configured', { category, mode, options })
}
