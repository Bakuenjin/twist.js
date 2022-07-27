import {
  DynamicModule,
  Global,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Provider
} from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { Client } from 'tmi.js'
import { ListenersService } from './listeners'
import { TextCommandsService } from './text-commands'
import { TwistClientProvider } from './twist-client.provider'
import { TwistExplorerService } from './twist-explorer.service'
import {
  TwistModuleAsyncOptions,
  TwistModuleOptions,
  TwistOptionsFactory
} from './twist-options.interface'
import { TWIST_MODULE_OPTIONS } from './twist.constants'

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    TwistClientProvider,
    TwistExplorerService,
    TextCommandsService,
    ListenersService
  ]
})
export class TwistModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  public static forRoot(options: TwistModuleOptions): DynamicModule {
    return {
      module: TwistModule,
      providers: [
        {
          provide: TWIST_MODULE_OPTIONS,
          useValue: options
        }
      ],
      exports: []
    }
  }

  public static forRootAsync(options: TwistModuleAsyncOptions): DynamicModule {
    return {
      module: TwistModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options)
    }
  }

  private static createAsyncProviders(
    options: TwistModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ]
  }

  private static createAsyncOptionsProvider(
    options: TwistModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TWIST_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      }
    }

    return {
      provide: TWIST_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TwistOptionsFactory) =>
        await optionsFactory.createTwistOptions(),
      inject: [options.useClass || options.useExisting]
    }
  }

  public constructor(private readonly client: Client) {}

  public onApplicationBootstrap(): void {
    this.client.connect()
  }

  public onApplicationShutdown(): void {
    this.client.disconnect()
  }
}
