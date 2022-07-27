import { Provider } from '@nestjs/common'
import { Client } from 'tmi.js'
import { TwistModuleOptions } from './twist-options.interface'
import { TWIST_MODULE_OPTIONS } from './twist.constants'

export const TwistClientProvider: Provider<Client> = {
  provide: Client,
  useFactory: (options: TwistModuleOptions) => new Client(options),
  inject: [TWIST_MODULE_OPTIONS]
}
