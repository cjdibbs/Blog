import {computedFrom, inject} from 'aurelia-framework';
import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {Router, RouterConfiguration} from 'aurelia-router'
import {Post} from 'post'
import { EventAggregator } from 'aurelia-event-aggregator';

type tagDatum = { tag:string, count: number};
declare var ga : any;

@inject(HttpClient, EventAggregator)
export class App {
  router: Router;
  posts: Post[] = [];  
  client : HttpClient;
  tag: string;
  eventAggregator: EventAggregator
  
  constructor(client: HttpClient, eventAggregator: EventAggregator){
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
        
    this.eventAggregator = eventAggregator;
    
    this.eventAggregator.subscribe("router:navigation:complete", this.navigationComplete)
  }
  
  navigationComplete(args: any) {
    if(!window.location.host.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)) {
      ga('set', 'page', args.instruction.fragment);
      ga('send', 'pageview');
    }
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Dibbs's Musings";
    config.map([
      { route: ['', ':tag'], name: 'posts', moduleId: 'posts', nav: false, title: 'Home' },
      { route: ['post/:date/:title'], name: 'post', moduleId: 'view-post', nav: false, title: "change-me"}
    ]);
    
    this.router = router;
  }
  
  @computedFrom('filteredPosts')
  get latestPosts(): Post[] {
    return this.filteredPosts.map(p=>p).splice(0,3);
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
    
    return ret.sort((a,b) => b.count - a.count);
  }
}