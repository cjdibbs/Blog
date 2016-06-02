import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Router, RouterConfiguration} from 'aurelia-router'
import {Post} from 'post'

@inject(HttpClient)
export class App {
  router: Router;
  posts: Post[];  
  client : HttpClient;
  
  
  constructor(client: HttpClient){
    this.client = client.configure(config => {
      config.useStandardConfiguration()
    });
    
    this.client.fetch('/posts')
        .then(r => r.json())
        .then(data => {
          this.posts = data.map(datum => new Post(datum, this.client));
        });
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Best Blag in the East';
    config.map([
      { route: ['', 'Home'], name: 'posts', moduleId: 'posts', nav: true, title: 'Home' },
      { route: ['post/:date/:title'], name: 'post', moduleId: 'view-post', nav: false, title: "change-me"}
    ]);
    
    this.router = router;
  }
}