import {App} from 'app';
import {Post} from 'post';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {MultiObserver} from 'multi-observer';

@inject(App, Router, MultiObserver)
export class Posts {
     app: App;
     router: Router;
     tag: string;
     filteredPosts: Post[];
     
     constructor(app: App, router: Router, multiObserver: MultiObserver) {
         this.app = app;
         this.router = router;
         
         multiObserver.observe(
             [[this, 'tag'],
              [this.app, 'posts']
             ],
             () => this.appFilter()
        );
     }
     
     appFilter(){
         if(!this.app.posts)
            return;
         if(!this.tag)
            this.filteredPosts = this.app.posts;
         else 
            this.filteredPosts = this.app.posts.filter(p => p.tags.indexOf(this.tag) >= 0);
     }
     
     activate(params: { tag: string}){
         this.tag = params.tag;
         this.appFilter();
     }
     
     open(post:Post) {
         this.router.navigate(`post/${post.date}/${post.title}`);
     }
}