import { LocatorStorage, Type } from '@fm/di';
import { Observable } from 'rxjs';
import { BasicExtension, serializeAction } from './basic/basic.extension';
import { ControlOptions } from './form/type-api';
import { Grid } from './type-api';
export declare const forwardGetJsonConfig: (getJsonConfig: (configName: string, ls: LocatorStorage) => Observable<object>) => void;
export declare const forwardFormControl: (factoryFormControl: (value: any, options: ControlOptions, ls: LocatorStorage) => any) => void;
export declare const forwardBuilderLayout: (createElement: (grid: Grid, ls?: LocatorStorage) => any) => void;
export declare const registryExtension: (extensions: Type<BasicExtension>[]) => void;
export declare const InjectableValidator: () => <T>(target: Type<T>) => Type<T>;
export * from './action';
export * from './action/create-actions';
export * from './basic/basic.extension';
export * from './constant/calculator.constant';
export * from './form/type-api';
export { BuilderExtensionsModel as BuilderModel } from './model/builder-extension-model';
export * from './type-api';
export * from './view-model/base.view';
export { serializeAction };
