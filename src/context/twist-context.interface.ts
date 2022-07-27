import { Events } from 'tmi.js'

export type ContextOf<K extends keyof Events> = Parameters<Events[K]>
