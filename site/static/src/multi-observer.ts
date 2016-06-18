import {BindingEngine} from 'aurelia-binding';        // or from 'aurelia-framework'
import {inject} from 'aurelia-framework';

@inject(BindingEngine)
export class MultiObserver {
    bindingEngine : BindingEngine;
    
    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
    }

    observe(properties, callback) {
        var subscriptions = [], i = properties.length, object, propertyName;
        while(i--) {
            object = properties[i][0];
            propertyName = properties[i][1];
            subscriptions.push(this.bindingEngine.propertyObserver(object, propertyName).subscribe(callback));
        }

        // return dispose function
        return {
            dispose: () => {
                while(subscriptions.length) {
                    subscriptions.pop().dispose();
                }
            }
        }
    }
}