import { Events } from 'tmi.js'
import { Listener } from './listener.decorator'

export const Once = <K extends keyof Events>(event: K) =>
  Listener({ type: 'once', event })
