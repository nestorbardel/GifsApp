import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];

  private readonly apiKey: string = 'ZytX2JiYgGLFL2BaRGp2LbTw129Ce2Oi';
  private readonly serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private readonly http: HttpClient) {
    this.loadLocalStorage();
    console.log("Gifs Service ready");
    this.searchByPosition(0);
  }


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

    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    console.log(this._tagsHistory);

  }

  private searchByPosition(position: number){
    if(position > (this._tagsHistory.length - 1)) return;
    const tag = this._tagsHistory[position];
    this.searchTag(tag);
  }

  public searchTag(tag: string):void{
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
    .subscribe(resp => {
      this.gifList = resp.data;
      console.log({gifs: this.gifList});

    })
  }
}
