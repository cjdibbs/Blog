import {App} from 'app';
import {Post} from 'post';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';


@inject(App, Router)
export class Posts {
     app: App;
     router: Router;
     
     constructor(app: App, router: Router) {
         this.app = app;
         this.router = router;
         
     }
     
     activate(params: { tag: string}){
         this.app.tag = params.tag;
     }
     
     open(post:Post) {
         this.router.navigate(`post/${post.date}/${post.title}`);
     }
}