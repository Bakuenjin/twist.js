import { Reflector } from '@nestjs/core'
import { TextCommandDiscovery } from '../text-commands/text-commands.discovery'

interface DiscoveredItem {
  class: any
  handler?: (...args: any[]) => any
}

export abstract class TwistBaseDiscovery<M = any, C = any, R = void> {
  protected readonly reflector = new Reflector()
  protected discovery: DiscoveredItem
  protected contextCallback: (
    context: C,
    instance: TwistBaseDiscovery<M, C, R>
  ) => R

  public constructor(protected readonly meta: M) {}

  public getClass() {
    return this.discovery.class
  }

  public getHandler() {
    return this.discovery.handler
  }

  public setDiscoveryMeta(meta: DiscoveredItem) {
    this.discovery ??= meta
  }

  public setContextCallback(
    callback: (context: C, instance: TwistBaseDiscovery<M, C, R>) => R
  ) {
    this.contextCallback ??= callback
  }

  public execute(context: C) {
    return this.contextCallback(context, this)
  }

  public isTextCommand(): this is TextCommandDiscovery {
    return false
  }

  public abstract toJSON(): Record<string, any>
}
