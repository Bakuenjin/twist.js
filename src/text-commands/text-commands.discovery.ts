import { ContextOf } from '../context'
import { TwistBaseDiscovery } from '../context/twist-base.discovery'

export interface TextCommandMeta {
  name: string
  description: string
}

export class TextCommandDiscovery extends TwistBaseDiscovery<
  TextCommandMeta,
  ContextOf<'message'>,
  Promise<string | void> | string | void
> {
  public getName() {
    return this.meta.name
  }

  public getDescription() {
    return this.meta.description
  }

  public isTextCommand(): this is TextCommandDiscovery {
    return true
  }

  public override toJSON(): Record<string, any> {
    return JSON.parse(JSON.stringify(this.meta))
  }
}
