import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory: string[] = [];

  private apiKey: string = 'ZytX2JiYgGLFL2BaRGp2LbTw129Ce2Oi';

  constructor(private http: HttpClient) { }


  get tagsHistory(): string[]{
    return [... this._tagsHistory];
  }

  private organizeHistory(tag: string):void {

    tag = tag.toLowerCase();
    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0,10);
  }

  public searchTag(tag: string):void{
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=ZytX2JiYgGLFL2BaRGp2LbTw129Ce2Oi&q=valorant&limit=10`)
    .subscribe(resp => {
      console.log(resp);

    })
  }
}
