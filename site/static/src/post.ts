import {computedFrom} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

export class Post {
    tags : string[];
    summary : string;
    title : string;
    date : string;
    problem :string;
    _body : string;
    client : HttpClient;
    
    /**
     * @param datum summary downloaed from the service
     * @param client must be inilized already
     */
    constructor(datum, client : HttpClient){
        this.tags = datum.tags;
        this.summary = datum.summary;
        this.problem = datum.problem;
        this.date = datum.date;
        this.title = datum.title;
        this._body = null;
        this.client = client;
    }
    
    /**
     * @returns body, will lazy load from the web service if the body has not been
     *          loaded as of yet, note if it has not been loaded yet it will return null
     *          the first time.
     */
    @computedFrom('_body')
    get body() : string {
        if(this._body == null){
            this.client.fetch(`posts/${this.date}/${this.title}`)
                .then(r => r.text())
                .then(html => {
                    this._body = html
                });
        }
        
        return this._body;
    }
}