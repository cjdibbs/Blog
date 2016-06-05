import {inject, bindable, customElement} from 'aurelia-framework';


@customElement('post-body') // Define the name of our custom element
@inject(Element)
export class PostBody {
    @bindable body:string;
    element;
    
    constructor(element){
        this.element = element;
    }
}