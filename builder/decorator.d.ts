import { Type, TypeClass } from '@hwy-fm/di';
import { BuilderProps } from './type-api';
export declare const BUILDER_DEF = "__builder_def__";
export declare const INPUT_PROPS = "InputProps";
export declare const ROOT_MODEL = "ROOT_MODEL";
export declare const DYNAMIC_BUILDER = "DynamicBuilder";
export declare function makeBuilderDecorator(name: string, forward?: ((type: Type, props: BuilderProps) => any)): (props?: BuilderProps) => ClassDecorator;
export declare const makeCustomInputProps: (transform: (meta: any, props: any, type: TypeClass, prop: string) => any) => (key?: string) => import("../../di").TargetDecorator;
export declare const DynamicModel: (props?: BuilderProps) => ClassDecorator;
export declare const RootModel: () => import("../../di").TargetDecorator;
export declare const InputProps: (key?: string) => import("../../di").TargetDecorator;
