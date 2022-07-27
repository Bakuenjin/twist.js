import { Injectable, OnModuleInit } from '@nestjs/common'
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator'
import { ParamMetadata } from '@nestjs/core/helpers/interfaces/params-metadata.interface'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import { TwistContextType } from './twist-execution-context'
import { TwistParamsFactory } from './twist-params.factory'

export let createTwistContext: <T extends Record<string, any>>(
  instance: T,
  prototype: any,
  methodName: string
) => (...args) => void

@Injectable()
export class TwistContextCreator implements OnModuleInit {
  private readonly twistParamsFactory: TwistParamsFactory

  public constructor(
    private readonly externalContextCreator: ExternalContextCreator
  ) {
    this.twistParamsFactory = new TwistParamsFactory()
  }

  public onModuleInit() {
    createTwistContext = (instance, prototype, methodName) => {
      return this.externalContextCreator.create<
        Record<number, ParamMetadata>,
        TwistContextType
      >(
        instance,
        prototype[methodName],
        methodName,
        ROUTE_ARGS_METADATA,
        this.twistParamsFactory,
        STATIC_CONTEXT,
        undefined,
        { guards: true, filters: true, interceptors: true },
        'twist'
      )
    }
  }
}
