import { Injectable } from '@nestjs/common'
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator'
import { ParamMetadata } from '@nestjs/core/helpers/interfaces/params-metadata.interface'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { TwistBaseDiscovery, TwistParamsFactory } from './context'
import { TwistContextType } from './context/twist-execution-context'

@Injectable()
export class TwistExplorerService<
  T extends TwistBaseDiscovery
> extends Reflector {
  private readonly twistParamsFactory: TwistParamsFactory
  private readonly wrappers: InstanceWrapper<any>[]

  public constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly metadataScanner: MetadataScanner
  ) {
    super()

    this.twistParamsFactory = new TwistParamsFactory()
    this.wrappers = this.discoveryService.getProviders().filter((wrapper) => {
      const instance = wrapper.instance
      const prototype = instance ? Object.getPrototypeOf(instance) : null

      return instance && prototype && wrapper.isDependencyTreeStatic()
    })
  }

  public explore(metadataKey: string): T[] {
    return this.flatMap((wrapper) =>
      this.filterProperties(wrapper, metadataKey)
    )
  }

  private flatMap(callback: (wrapper: InstanceWrapper) => T[]) {
    return this.wrappers.flatMap(callback).filter(Boolean)
  }

  private filterProperties({ instance }: InstanceWrapper, metadataKey: string) {
    const prototype = Object.getPrototypeOf(instance)

    return this.metadataScanner.scanFromPrototype(
      instance,
      prototype,
      (methodName) => {
        const item = this.get<T>(metadataKey, instance[methodName])

        if (!item) return

        item.setDiscoveryMeta({
          class: instance.constructor,
          handler: instance[methodName]
        })

        item.setContextCallback(
          this.createContextCallback(instance, prototype, methodName)
        )

        return item
      }
    )
  }

  private createContextCallback(
    instance: object,
    prototype: unknown,
    methodName: string
  ) {
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
