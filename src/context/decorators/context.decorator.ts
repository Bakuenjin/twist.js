import { TwistParamType } from '../twist-param-type.enum'
import { createTwistParamDecorator } from './params.util'

export const Context = createTwistParamDecorator(TwistParamType.CONTEXT)
