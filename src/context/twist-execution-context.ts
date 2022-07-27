import { ContextType, ExecutionContext } from '@nestjs/common'
import { TwistArgumentsHost } from './twist-argument-host'

export type TwistContextType = 'twist' | ContextType

export class TwistExecutionContext extends TwistArgumentsHost {
  public static create(context: ExecutionContext): TwistExecutionContext {
    const twistContext = new TwistExecutionContext(
      context.getArgs(),
      context.getClass(),
      context.getHandler()
    )
    twistContext.setType(context.getType())
    return twistContext
  }
}
