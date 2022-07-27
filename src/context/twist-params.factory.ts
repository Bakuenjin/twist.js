import { ParamData } from '@nestjs/common'
import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator'
import { TwistBaseDiscovery } from './twist-base.discovery'
import { TwistParamType } from './twist-param-type.enum'

export class TwistParamsFactory implements ParamsFactory {
  public exchangeKeyForValue(
    type: number,
    _data: ParamData,
    args: [Array<any>, TwistBaseDiscovery]
  ) {
    if (!args) return null

    switch (type as TwistParamType) {
      case TwistParamType.CONTEXT:
        return args[0]
      case TwistParamType.DISCOVERY:
        return args[1]
      default:
        return null
    }
  }
}
