import { Events } from 'tmi.js'
import { Listener } from './listener.decorator'

export const On = <K extends keyof Events>(event: K) =>
  Listener({ type: 'on', event })
