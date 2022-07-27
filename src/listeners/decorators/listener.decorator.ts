import { SetMetadata } from '@nestjs/common'
import { LISTENERS_METADATA } from '../../twist.constants'
import { ListenerDiscovery, ListenerMeta } from '../listeners.discovery'

export const Listener = (options: ListenerMeta) =>
  SetMetadata<string, ListenerDiscovery>(
    LISTENERS_METADATA,
    new ListenerDiscovery(options)
  )
