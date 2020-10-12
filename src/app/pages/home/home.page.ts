import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  
  pages = [
    {
      title: 'Home',
      url: '/home/summary',
      icon: 'home'
    }
  ];

  selectedPath = '';
  
  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  
}
