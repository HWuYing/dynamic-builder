import { BasicExtension } from '../basic/basic.extension';
export declare class FormExtension extends BasicExtension {
    private builderFields;
    private defaultChangeType;
    private getControl;
    private covertIntercept;
    protected extension(): void;
    private createMergeControl;
    private addChangeAction;
    private addControl;
    private createChange;
    private createValidaity;
    private createVisibility;
    private changeVisibility;
    private excuteChangeEvent;
    private createNotifyChange;
    private detectChanges;
    private getChangeType;
    private getValueToModel;
    private setValueToModel;
    private deleteValueToModel;
    private isDomEvent;
    destory(): void | import("rxjs").Observable<any>;
}
