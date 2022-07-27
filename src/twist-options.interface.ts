import { ModuleMetadata, Type } from '@nestjs/common'
import { ChatUserstate, Options } from 'tmi.js'

export interface TwistModuleOptions extends Options {
  prefix?:
    | string
    | ((
        channel: string,
        tags: ChatUserstate,
        message: string
      ) => string | Promise<string>)
}

export interface TwistOptionsFactory {
  createTwistOptions(): Promise<TwistModuleOptions> | TwistModuleOptions
}

export interface TwistModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TwistOptionsFactory>
  useClass?: Type<TwistOptionsFactory>
  inject?: any[]
  useFactory?: (
    ...args: any[]
  ) => Promise<TwistModuleOptions> | TwistModuleOptions
}
