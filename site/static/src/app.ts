import {computedFrom, inject} from 'aurelia-framework';
import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {Router, RouterConfiguration} from 'aurelia-router'
import {Post} from 'post'

type tagDatum = { tag:string, count: number};

@inject(HttpClient)
export class App {
  router: Router;
  posts: Post[] = [];  
  client : HttpClient;
  tag: string;
  
  constructor(client: HttpClient){
    this.client = client.configure(config => {
      config.useStandardConfiguration()
    });
    
    this.client.fetch('/posts')
        .then(r => r.json())
        .then(data => {
          this.posts = data.map(datum => new Post(datum, this.client))
              .sort((a:Post, b:Post) => {
                if(a.date < b.date)
                  return 1;
                if(b.date < a.date)
                  return -1;
                return 0;
              });
        });
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Dibbs's Musings";
    config.map([
      { route: ['', ':tag'], name: 'posts', moduleId: 'posts', nav: false, title: 'Home' },
      { route: ['post/:date/:title'], name: 'post', moduleId: 'view-post', nav: false, title: "change-me"}
    ]);
    
    this.router = router;
  }
  
  @computedFrom('posts', 'tag')
  get filteredPosts(): Post[] {
    if(this.tag)
      return this.posts.filter(p => p.tags.indexOf(this.tag) >= 0);
    return this.posts;
  }
  
  @computedFrom('posts')
  get tags(): tagDatum[] {
    
    var ret : tagDatum[] = [];
    
    this.posts.forEach(post => post.tags.forEach(tag => {
      var datum = ret.find(d => d.tag === tag );
      if(datum)
        datum.count += 1;
      else
        ret.push({'tag': tag, count:1});
    }));
    
    return ret.sort((a,b) => a.count - b.count);
  }
}