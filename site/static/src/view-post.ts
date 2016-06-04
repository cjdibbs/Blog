import {App} from 'app';
import {Post} from 'post';
import {inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
  
declare var hljs : any;
declare var jQuery : any;

@inject(App, BindingEngine)
export class ViewPost {
    app: App;
    post: Post;
    bindingEngine: BindingEngine;
    subscription: any;
    
    constructor(app:App, bindingEngine:BindingEngine){
        this.app = app;
        this.bindingEngine = bindingEngine;
    }
    
    activate(params : { date: string, title: string }, routeConfig) : void {
        this.post = this.app.posts.find(p => p.date === params.date && p.title == params.title);
        routeConfig.navModel.setTitle(params.title);
        
        this.subscription = this.bindingEngine
            .propertyObserver(this.post, 'body')
            .subscribe(this.updateBody);
    }
    
    attached(){
        if(this.post.body){
            this.updateBody(this.post.body);
        }
    }
    
    deactivate() {
        if(this.subscription)
            this.subscription.dispose();
    }
    
    updateBody(body: string){
        var html = jQuery(body);
        
        var section = jQuery('section.post-body');
        section.empty().append(html).find('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }
}