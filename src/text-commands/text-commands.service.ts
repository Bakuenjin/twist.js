import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit
} from '@nestjs/common'
import { Client } from 'tmi.js'
import { TwistExplorerService } from '../twist-explorer.service'
import { TwistModuleOptions } from '../twist-options.interface'
import { TEXT_COMMAND_METADATA, TWIST_MODULE_OPTIONS } from '../twist.constants'
import { TextCommandDiscovery } from './text-commands.discovery'

@Injectable()
export class TextCommandsService
  implements OnModuleInit, OnApplicationBootstrap
{
  private readonly textCommands = new Map<string, TextCommandDiscovery>()

  public constructor(
    @Inject(TWIST_MODULE_OPTIONS)
    private readonly options: TwistModuleOptions,
    private readonly client: Client,
    private readonly explorerService: TwistExplorerService<TextCommandDiscovery>
  ) {}

  public onModuleInit() {
    return this.explorerService
      .explore(TEXT_COMMAND_METADATA)
      .forEach((textCommand) =>
        this.textCommands.set(textCommand.getName(), textCommand)
      )
  }

  public onApplicationBootstrap() {
    return this.client.on('message', async (channel, tags, message, self) => {
      if (!message || self) return

      const prefix =
        typeof this.options.prefix !== 'function'
          ? this.options.prefix ?? '!'
          : await this.options.prefix(channel, tags, message)

      if (!prefix || !message.startsWith(prefix)) return

      const args = message.substring(prefix.length).split(/ +/g)
      const cmd = args.shift()

      if (!cmd) return

      try {
        const reply = await this.textCommands
          .get(cmd)
          ?.execute([channel, tags, message, self])

        if (reply) await this.client.say(channel, reply)
      } catch (error) {
        // TODO: error handling?
      }
    })
  }
}
