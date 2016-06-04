import {inject, bindable, customElement} from 'aurelia-framework';

declare var hljs : any;
declare var jQuery : any;

@customElement('post-body') // Define the name of our custom element
@inject(Element)
export class PostBody {
    @bindable body:string;
    element;
    
    constructor(element){
        this.element = element;
    }
}