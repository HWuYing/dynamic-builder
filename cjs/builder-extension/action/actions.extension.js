"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var ActionExtension = /** @class */ (function (_super) {
    tslib_1.__extends(ActionExtension, _super);
    function ActionExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = [];
        return _this;
    }
    ActionExtension.prototype.extension = function () {
        var eachCallback = this.create.bind(this);
        var handler = this.eachFields.bind(this, this.jsonFields, eachCallback);
        this.pushCalculators(this.json, {
            action: { type: calculator_constant_1.LOAD_ACTION, handler: handler },
            dependents: { type: calculator_constant_1.LOAD_VIEW_MODEL, fieldId: this.builder.id }
        });
    };
    ActionExtension.prototype.create = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var _b = jsonField.actions, actions = _b === void 0 ? [] : _b;
        this.defineProperty(builderField, calculator_constant_1.ADD_EVENT_LISTENER, this.addFieldEvent.bind(this, builderField));
        if (!(0, lodash_1.isEmpty)(actions))
            builderField.addEventListener(actions);
        this.fields.push(builderField);
        delete builderField.field.actions;
    };
    ActionExtension.prototype.addFieldEvent = function (builderField, actions) {
        var _this = this;
        var _a = builderField.events, events = _a === void 0 ? {} : _a, id = builderField.id;
        var addActions = this.toArray(actions).filter(function (_a) {
            var type = _a.type;
            return !events[_this.getEventType(type)];
        });
        if (!(0, lodash_1.isEmpty)(addActions)) {
            var addEvents = this.createActions(this.toArray(addActions), { builder: this.builder, id: id }, { injector: this.injector });
            this.defineProperty(builderField, calculator_constant_1.EVENTS, tslib_1.__assign(tslib_1.__assign({}, events), addEvents));
            builderField.instance.detectChanges();
        }
    };
    ActionExtension.prototype.destory = function () {
        var _this = this;
        this.fields.forEach(function (field) { return _this.unDefineProperty(field, [calculator_constant_1.EVENTS, calculator_constant_1.ADD_EVENT_LISTENER]); });
        _super.prototype.destory.call(this);
    };
    return ActionExtension;
}(basic_extension_1.BasicExtension));
exports.ActionExtension = ActionExtension;
