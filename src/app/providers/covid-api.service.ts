import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum SearchType {
  all = 'all',
  summary = 'summary',
  total = 'total',
  dayone = 'dayone',
  country = 'country'
}

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {
  url = 'https://api.covid19api.com/'
  constructor(
    public http: HttpClient
  ) { }

  default(): Observable<any>{
    return this.http.get(this.url)
  }

  summary(): Observable<any>{
    return this.http.get(this.url + SearchType.summary)
  }

  // worldTotalWip(): Observable<any>{
  //   return this.http.get(this.url + SearchType.world + '/' + SearchType.total)
  // }

  dayOneTotalAllStatus(country: string){
    return this.http.get(this.url + SearchType.total + '/' + SearchType.dayone + '/' + SearchType.country + '/' + country )
  }

  dayOneAllStatus(country: string){
    console.log('dayOneAllStatus',this.url  + SearchType.dayone + '/' + SearchType.country + '/' + country )
    return this.http.get(this.url  + SearchType.dayone + '/' + SearchType.country + '/' + country )
  }
}
