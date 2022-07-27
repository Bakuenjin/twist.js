import { Injectable, OnModuleInit } from '@nestjs/common'
import { Client, Events } from 'tmi.js'
import { TwistExplorerService } from '../twist-explorer.service'
import { LISTENERS_METADATA } from '../twist.constants'
import { ListenerDiscovery } from './listeners.discovery'

@Injectable()
export class ListenersService implements OnModuleInit {
  public constructor(
    private readonly client: Client,
    private readonly explorerService: TwistExplorerService<ListenerDiscovery>
  ) {}

  public onModuleInit() {
    return this.explorerService
      .explore(LISTENERS_METADATA)
      .forEach((listener) =>
        this.client[listener.getType()](
          listener.getEvent() as keyof Events,
          (...args) => listener.execute(args)
        )
      )
  }
}
