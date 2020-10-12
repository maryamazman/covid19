import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { CovidApiService } from '../../providers/covid-api.service';

declare var google: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  @ViewChild('barChart') barChart;
  form: FormGroup;
  data: any;
  globalSummary: string;
  allData:string;
  selectOptions:string;
  countries: string;
  countryList: any = ['malaysia'];
  message: string;
  date: any;
  infoWindows: any = [];
  map: any;
  markers: any = [
    {
      title: "testing",
      latitude: "-17.824991",
      longitude: "31.049295"
    }
  ]

  chartData: ChartDataSets[] = [{
    data: [],
    label: 'Active cases in the world'
  }];

  chartLabel: Label[];
  chartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'The cases of Covid19 in world wide'
    },
    pan: {
      enabled: true,
      mode: 'xy'
    },
    zoom: {
      enabled: true,
      mode: 'xy'
    }
  }
  chartColors: Color[] = [
    {
      borderColor: '#0000',
      backgroundColor: '#536DFE'
    }
  ]

  chartType = 'line';
  showLegend = false;

  bars: any;
  colorArray: any;
  
  country:string;
  countryNewConfirm:string;
  countryNewRecovered:string;
  countryNewDeath:string;

  countryTotalConfirm:string;
  countryTotalRecovered:string;
  countryTotalDeath:string;
  countryDate:string;
  countryLat:string;
  countryLon:string;
  constructor(

    private covidApi: CovidApiService
  ) { }

  ngOnInit() {
    // this.form = new FormGroup({
    //   country: new FormControl('')
    // })
  }

  ionViewWillEnter() {
    this.covidDefault();
    this.covidSummary();
    // this.CovidDayOneTotalAllStatus();
    this.CovidDayOneAllStatus();
    // this.showMap();
    
  }

  selectCountry(data: any){
    console.log('selectCountry',data)
    this.country = data.Country;
    this.countryDate = data.Date;
    this.countryDate =  Date().toString();
    this.countryNewConfirm = data.NewConfirmed;
    this.countryNewRecovered = data.NewRecovered;
    this.countryNewDeath = data.NewDeaths;

    this.countryTotalConfirm = data.TotalConfirmed;
    this.countryTotalRecovered = data.TotalRecovered;
    this.countryTotalDeath = data.TotalDeaths;

    // this.countryLat = data.
    // this.showMap();
  }

  covidDefault() {
    try {
      this.covidApi.default().subscribe(
        res => {
          this.data = res;
          console.log("covidDefault");
          console.log(this.data);
        }
      )
    }
    catch (error) {
      console.log(error)
    }
  }

  covidSummary() {
    try {
      this.covidApi.summary().subscribe(
        res => {
          this.data = res;
          console.log("covidSummary");
          console.log(this.data);

          console.log("Global");
          this.globalSummary = this.data.Global;
          console.log(this.globalSummary);

          console.log("countries");
          this.countries = this.data.Countries;
          console.log(this.countries)
          
          console.log("message");
          this.message = this.data.Message;
          console.log(this.message);

          console.log("date");
          this.date = new Date().toDateString();
          console.log(this.date)

          if (this.countries) {
            // this.chart(this.countries);
            // this.createBarChart(this.countries);
            this.CovidDayOneAllStatus()
          }

          if(this.globalSummary){
            this.createBarChart(this.globalSummary)
          }
        }
      )
    }
    catch (error) {
      console.log(error)
    }
  }

  CovidDayOneTotalAllStatus(){
    try{
      this.covidApi.dayOneTotalAllStatus(this.countryList).subscribe(
        res => {
          this.data = res;
          console.log('CovidDayOneTotalAllStatus');
          console.log(this.data);
        }
      )

    }
    catch(error){
      console.log(error)
    }
  }

  CovidDayOneAllStatus(){
   
    try {
      this.covidApi.dayOneAllStatus(this.countryList).subscribe(
        res => {
          this.data = res;
          console.log("CovidDayOneAllStatus", this.data)
          // this.showMap(this.data);
        }
      )
    }
    catch(error){
      console.log(error)
    }
  }

  // chart(data: any) {
  //   this.chartData[0].data = [];
  //   this.chartLabel = [];
  //   for (var index in data) {
  //     let data2 = data[index];
  //     this.chartLabel.push(data2.Country);
  //     this.chartData[0].data.push(data2['NewConfirmed']);
      
  //   }


  // }

  createBarChart(data:any) {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Recovered', 'Death'],
        datasets: [{
          label: 'New cases in world wide',
          data: [data.NewConfirmed, data.NewRecovered, data.NewDeaths],
          backgroundColor: ['#F1C645','#79CFAE','#E65C5D'], // array should have same number of elements as number of dataset
          borderColor:[ 'yellow','green','red'],// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    console.log(this.bars.chart.config.data.datasets)
     
    let data2 = this.bars.chart.config.data.datasets;
    for(var index in data2){
      console.log(data2[index].label)
      this.chartLabel = data2[index].label;
    }
  }

  addMarkerToMap(markers) {
    for (let marker of markers) {
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker) {
    let infoWindowContent = '<div id="content">' +
      '<h2 id="firstHeading" class="firstHeading">' + marker.title + '</h2>' +
      '<p> Latitude:' + marker.latitude + '</p>' +
      '<p> Longitude:' + marker.longitude + '</p>' +
      '</div>';
    var infoWindow = new google.maps.InfoWindow({
      content: " "
    });


    marker.addListener('click', () => {
      infoWindow.setContent(infoWindowContent);
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    })
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for (let window of this.infoWindows) {
      window.close();
    }
  }

  showMap(dayOneData: any) {
    for(let data of dayOneData){
      const location = new google.maps.LatLng(-17.824858, 31.053028)
      const options = {
        center: location,
        zoom: 15,
        disableDefaultUI: true
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  
      this.addMarkerToMap(this.markers);
    }
    }
   
}
