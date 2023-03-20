import { isEmpty } from 'lodash';
import { Observable, shareReplay, Subject, tap } from 'rxjs';
import { BuilderModel } from '../../builder/builder-model';
import { observableMap, toForkJoin, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CURRENT, DESTROY, INSTANCE, LOAD_ACTION, MOUNTED } from '../constant/calculator.constant';
export class InstanceExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.buildFieldList = [];
    }
    static createInstance() {
        return {
            current: null,
            onMounted: () => void (0),
            onDestroy: () => void (0),
            detectChanges: () => undefined,
            destroy: new Subject().pipe(shareReplay(1))
        };
    }
    extension() {
        this.buildFieldList = this.mapFields(this.jsonFields, this.addInstance.bind(this));
        const handler = this.eachFields.bind(this, this.jsonFields, this.createInstanceLife.bind(this));
        this.pushCalculators(this.json, [{
                action: this.bindCalculatorAction(handler),
                dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
            }]);
    }
    createInstanceLife([, builderField]) {
        const { instance, events = {} } = builderField;
        this.definePropertys(instance, {
            [this.getEventType(MOUNTED)]: events.onMounted,
            [this.getEventType(DESTROY)]: events.onDestroy
        });
        Object.defineProperty(instance, CURRENT, this.getCurrentProperty(builderField));
        delete events.onMounted;
        delete events.onDestroy;
    }
    getCurrentProperty({ instance, id }) {
        let _current;
        const get = () => _current;
        const set = (current) => {
            const hasMounted = !!current && _current !== current;
            _current = current;
            if (hasMounted) {
                instance.onMounted(id);
            }
            if (current instanceof BuilderModel && current.id !== id) {
                console.info(`Builder needs to set the id property: ${id}`);
            }
        };
        return { get, set };
    }
    addInstance([jsonField, builderField]) {
        const destroy = { type: DESTROY, after: this.bindCalculatorAction(this.instanceDestroy) };
        const instance = InstanceExtension.createInstance();
        this.pushAction(jsonField, [destroy, { type: MOUNTED }]);
        this.defineProperty(builderField, INSTANCE, instance);
        instance.destroy.subscribe();
    }
    instanceDestroy({ actionEvent, builderField: { instance } }) {
        const currentIsBuildModel = instance.current instanceof BuilderModel;
        instance.current && (instance.current = null);
        instance.detectChanges = () => undefined;
        return !currentIsBuildModel && instance.destroy.next(actionEvent);
    }
    beforeDestroy() {
        const showFields = this.buildFieldList.filter(({ visibility }) => this.builder.showField(visibility));
        if (!isEmpty(showFields)) {
            const subscriptions = [];
            return toForkJoin(showFields.map(({ id, instance }) => new Observable((subscribe) => {
                subscriptions.push(instance.destroy.subscribe(() => {
                    subscribe.next(id);
                    subscribe.complete();
                }));
            }))).pipe(tap(() => subscriptions.forEach((s) => s.unsubscribe())), observableMap(() => transformObservable(super.beforeDestroy())));
        }
    }
    destroy() {
        this.buildFieldList.forEach((buildField) => {
            const { instance } = buildField;
            instance.destroy.unsubscribe();
            this.unDefineProperty(instance, ['detectChanges', this.getEventType(DESTROY), this.getEventType(MOUNTED), CURRENT]);
            this.defineProperty(buildField, INSTANCE, null);
        });
        return super.destroy();
    }
}
