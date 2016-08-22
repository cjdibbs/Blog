import {App} from 'app';
import {Post} from 'post';
import {inject} from 'aurelia-framework';
import {Redirect, Router} from 'aurelia-router';

@inject(App, Router)
export class Posts {
     app: App;
     router: Router;
     static once: Boolean = false;

     constructor(app: App, router: Router) {
         this.app = app;
         this.router = router;
         
     }

     canActivate(){
        if(!Posts.once){
            Posts.once = true;
            var fragment = decodeURIComponent(window.location.search.substring(1));
            
            if(fragment)
                return new Redirect(fragment);
        }
     }
     
     activate(params: { tag: string}){
         this.app.tag = params.tag;
     }
     
     open(post:Post) {
         this.router.navigate(`post/${post.date}/${post.title}`);
     }
}