import {App} from 'app';
import {Post} from 'post';
import {inject} from 'aurelia-framework';

@inject(App)
export class ViewPost {
    app: App;
    post: Post;
    
    constructor(app:App){
        this.app = app;
    }
    
    activate(params : { date: string, title: string }, routeConfig) : void {
        this.post = this.app.posts.find(p => p.date === params.date && p.title == params.title);
        routeConfig.navModel.setTitle(params.title);
    }
}