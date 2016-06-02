import {App} from 'app';
import {Post} from 'post';
import {inject} from 'aurelia-framework';

@inject(App)
export class Posts {
     app: App;
     
     constructor(app: App) {
         this.app = app;
     }
}