import { Injector, InjectorToken, Type } from '@fm/di';
import { Observable } from 'rxjs';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
import { BaseAction } from '../action';
import { BasicExtension } from '../basic/basic.extension';
import { BaseConvert } from '../form/base-convert';
import { FormOptions } from '../form/type-api';
import { Grid } from '../grid/grid';
import { BuilderModelExtensions } from '../type-api';
export declare class BuilderContext extends BasicBuilderContext {
    private parent?;
    private extensions;
    private map;
    private typeMap;
    private clsMap;
    constructor(parent?: BuilderContext);
    private canExtends;
    private useFactory;
    private registryFactory;
    getType<T = any>(token: InjectorToken, name: string): T | null;
    getFactory<T>(token: InjectorToken): T;
    forwardClass<T = any>(token: InjectorToken, cls: Type<T>): void;
    forwardFactory<T = any>(token: InjectorToken, factory: T): void;
    forwardType<T = any>(token: InjectorToken, name: string, target: Type<T>, typeName?: string): void;
    forwardGetJsonConfig(getJsonConfig: (configName: string, injector: Injector) => Observable<object>): void;
    forwardFormControl(factoryFormControl: (value: any, options: FormOptions, injector: Injector) => any): void;
    forwardBuilderLayout(createElement: (grid: Grid, builder: BuilderModelExtensions, injector: Injector) => any): void;
    forwardAction(name: string, action: Type<BaseAction>, options?: any): void;
    forwardConvert(name: string, convert: Type<BaseConvert>): void;
    registryExtension(extensions: Type<BasicExtension>[]): void;
    registryInjector(injector: Injector): void;
}
export declare const useBuilderContext: (parent?: BuilderContext) => BuilderContext;
