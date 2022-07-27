import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TwistExecutionContext } from '../../context/twist-execution-context'

export const Args = createParamDecorator((_, context: ExecutionContext) => {
  const twistContext = TwistExecutionContext.create(context)
  const discovery = twistContext.getDiscovery()

  if (!discovery.isTextCommand()) return null

  const message = twistContext.getContext<'message'>()[2]
  return message.split(/ +/g).slice(1)
})
