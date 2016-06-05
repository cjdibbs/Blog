import {inject} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-framework'; // or 'aurelia-binding'

@inject(ObserverLocator)
export class MultiObserver {  
    observerLocator: ObserverLocator
    
    constructor(observerLocator: ObserverLocator) {
        this.observerLocator = observerLocator;
    }

    observe(properties, callback) {
        var subscriptions = [], i = properties.length, object, propertyName;
        while(i--) {
            object = properties[i][0];
            propertyName = properties[i][1];
            subscriptions.push(this.observerLocator.getObserver(object, propertyName).subscribe(callback));
        }

        // return dispose function
        return () => {
            while(subscriptions.length) {
                subscriptions.pop()();
            }
        }
    }
}