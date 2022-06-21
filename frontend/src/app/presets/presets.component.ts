import {Component, OnInit} from '@angular/core';
import {dummyPresetList, hours} from "../../assets/dummyData";
import {ChartConfiguration} from 'chart.js';

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.css']
})
export class PresetsComponent implements OnInit {

  lineChartData: ChartConfiguration['data'] | undefined;

  isSelected = false;
  selectedPreset: any;
  hoursSelect = hours;
  presetList = dummyPresetList;
  currData: any;
  currKey: any;
  currHour: any;
  editPreset = false;
  tempVal: any;
  activePreset: any;

  constructor() {
  }

  ngOnInit() {
    //todo załadować presety i dane z backendu
    this.activePreset='Set point 1';

  }
  activatePreset(){
    this.activePreset=this.currKey;
    //todo wysłąć do BE
  }

  refreshChart() {
    // @ts-ignore
    let hours = this.currData.map(item => item.Hour);
    // @ts-ignore
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

  toggleEditPreset() {
    this.editPreset = true;
  }

  changeSelectedHour(hourKey: String) {
    this.currHour = hourKey;
    this.tempVal = this.currData.find((data: { Hour: String, Temperature: number; }) => data.Hour == hourKey).Temperature;
  }

  updateChart() {
    this.currData.find((data: { Hour: String, Temperature: number; }) => data.Hour == this.currHour).Temperature = this.tempVal;
    this.refreshChart();
  }

  savePreset(){
    //todo wysłać preset do BE
  }

}
