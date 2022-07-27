import { SetMetadata } from '@nestjs/common'
import { TEXT_COMMAND_METADATA } from '../../twist.constants'
import {
  TextCommandDiscovery,
  TextCommandMeta
} from '../text-commands.discovery'

export const TextCommand = (options: TextCommandMeta): MethodDecorator =>
  SetMetadata<string, TextCommandDiscovery>(
    TEXT_COMMAND_METADATA,
    new TextCommandDiscovery(options)
  )
