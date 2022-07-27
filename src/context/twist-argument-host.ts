import { ArgumentsHost } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { TwistBaseDiscovery } from './twist-base.discovery'
import { ContextOf } from './twist-context.interface'
import { TwistContextType } from './twist-execution-context'
import { Events } from 'tmi.js'

export interface ITwistArgumentsHost extends ArgumentsHost {
  getContext<T extends keyof Events>(): ContextOf<T>
  getOptions<T = any>(): T
  getDiscovery(): TwistBaseDiscovery
  getLocals<T extends Record<string, any>>(): T
}

export class TwistArgumentsHost
  extends ExecutionContextHost
  implements ITwistArgumentsHost
{
  public static create(context: ArgumentsHost): TwistArgumentsHost {
    const twistContext = new TwistArgumentsHost(context.getArgs())
    twistContext.setType(context.getType())
    return twistContext
  }

  public getType<TContext extends string = TwistContextType>(): TContext {
    return super.getType()
  }

  public getContext<T extends keyof Events>(): ContextOf<T> {
    return super.getArgByIndex(0)
  }

  public getOptions<T = any>(): T {
    return this.getArgByIndex(1)
  }

  public getDiscovery(): TwistBaseDiscovery {
    return this.getArgByIndex(2)
  }

  public getLocals<T extends Record<string, any>>(): T {
    return this.getArgByIndex(3)
  }
}
