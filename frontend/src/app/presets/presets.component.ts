import {Component, OnInit} from '@angular/core';
import {dummySetpointList} from "../../assets/dummyData";
import {ChartConfiguration} from 'chart.js';
import {hours} from "../../assets/hours";

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.css']
})
export class PresetsComponent implements OnInit {

  lineChartData: ChartConfiguration['data'] | undefined;

  hoursSelect = hours;
  presetList = dummySetpointList;
  isSelected = false;
  currData: any;
  currKey: any;
  currHour: any;
  tempVal: any;

  constructor() {
  }

  ngOnInit() {
    //todo załadować presety
  }

  refreshChart() {
    let hours = this.currData.map(item => item.Hour);
    let temperatures = this.currData.map(item => item.Temperature);

    this.lineChartData = {
      datasets: [
        {
          stepped: true,
          data: temperatures,
          label: 'Temperature',
        },
      ],
      labels: hours
    };
  }

  selectionChanged(presetKey: String) {
    this.isSelected = true;
    this.currKey = presetKey;
    this.currData = this.presetList.get(this.currKey);
    this.refreshChart();
  }

  changeSelectedHour(hourKey: String) {
    this.currHour = hourKey;
    this.tempVal = this.currData.find((data: { Hour: String, Temperature: number; }) => data.Hour == hourKey).Temperature;
  }

  updateChart() {
    this.currData.find((data: { Hour: String, Temperature: number; }) => data.Hour == this.currHour).Temperature = this.tempVal;
    this.refreshChart();
  }

  savePreset() {
    //todo wysłać preset do BE
  }

  tempChanged(temperature: number) {
    this.tempVal = temperature;
    this.currData.find((data: { Hour: String, Temperature: number; }) => data.Hour == this.currHour).Temperature = this.tempVal;
    this.updateChart();
  }

}
