import {Post} from 'post';
import {inject, bindable, customElement, BindingEngine, Disposable} from 'aurelia-framework';

declare var DISQUS : any;

@customElement('disqus') // Define the name of our custom element
@inject(Element, BindingEngine)
export class Disqus  {
    @bindable post : Post;
    element : Element;
    bindingEngine : BindingEngine;
    subscription : Disposable;

    constructor(element : Element, bindingEngine : BindingEngine){
        this.element = element;
        this.bindingEngine = bindingEngine;
    }

    attached(){
        this.subscription = this.bindingEngine.propertyObserver(this, 'post').subscribe(this.update);
        this.update(this.post);
    }

    detached(){
        this.subscription.dispose();
    }

    update(post){
        DISQUS.reset({
            reload: true,
            config: function() {
                this.page.identifier = `/${post.date}/${post.title}`;
                this.page.url = `http://blog.dibbs.tech/#!post/${post.date}/${post.title}`;
                this.page.title = post.title
            }
        });
    }
}