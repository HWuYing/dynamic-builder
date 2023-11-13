import { makeParamDecorator } from '@fm/di';
import { get } from 'lodash';
import { makeCustomInputProps } from '../builder/decorator';
import { getEventType } from './action';
import { EventZip } from './action/event-zip';
var ActionParams;
(function (ActionParams) {
    ActionParams["event"] = "event";
    ActionParams["field"] = "field";
    ActionParams["builder"] = "builder";
    ActionParams["callLink"] = "callLink";
    ActionParams["viewModel"] = "viewModel";
    ActionParams["intercept"] = "intercept";
    ActionParams["otherEvent"] = "otherEvent";
    ActionParams["instanceRef"] = "instanceRef";
    ActionParams["actionProps"] = "actionProps";
    ActionParams["fieldConfig"] = "fieldConfig";
})(ActionParams || (ActionParams = {}));
function getObjectByKey(obj, { key }) {
    return key ? obj && get(obj, key) : obj;
}
// eslint-disable-next-line complexity
function transform(annotation, value, baseAction, ...otherEvent) {
    var _a;
    switch (annotation.metadataName) {
        case ActionParams.otherEvent: return otherEvent;
        case ActionParams.builder: return baseAction.builder;
        case ActionParams.callLink: return baseAction.callLink;
        case ActionParams.instanceRef: return baseAction.instance;
        case ActionParams.intercept: return baseAction.actionIntercept;
        case ActionParams.event: return getObjectByKey(baseAction.actionEvent, annotation);
        case ActionParams.field: return getObjectByKey(baseAction.builderField, annotation);
        case ActionParams.actionProps: return getObjectByKey(baseAction.actionProps, annotation);
        case ActionParams.viewModel: return getObjectByKey((_a = baseAction.builder) === null || _a === void 0 ? void 0 : _a.viewModel, annotation);
        case ActionParams.fieldConfig: return getObjectByKey(baseAction.builderField.fieldConfig, annotation);
    }
    return value;
}
const proxyOutput = (_m, props, type, prop) => (event, ...otherEvent) => {
    const p = getEventType(prop);
    const output = get(props === null || props === void 0 ? void 0 : props.events, p, type[p]);
    return output(new EventZip(event), ...otherEvent);
};
const props = (obj = {}) => (Object.assign({ transform }, obj));
const keyProps = (key) => props({ key });
export const FieldRef = makeParamDecorator(ActionParams.field, keyProps);
export const BuilderRef = makeParamDecorator(ActionParams.builder, props);
export const InterceptRef = makeParamDecorator(ActionParams.intercept, props);
export const FieldConfigRef = makeParamDecorator(ActionParams.field, keyProps);
export const ViewModelRef = makeParamDecorator(ActionParams.viewModel, keyProps);
export const InstanceRef = makeParamDecorator(ActionParams.instanceRef, keyProps);
export const Output = makeCustomInputProps(proxyOutput);
export const Event = makeParamDecorator(ActionParams.event, keyProps);
export const CallLink = makeParamDecorator(ActionParams.callLink, keyProps);
export const OtherEvent = makeParamDecorator(ActionParams.otherEvent, keyProps);
export const ActionProps = makeParamDecorator(ActionParams.actionProps, keyProps);
