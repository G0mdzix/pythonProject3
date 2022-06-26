import {Component, OnInit} from '@angular/core';
import {ChartConfiguration} from 'chart.js';
import {ConnectionService} from "../connection/connection.service";

@Component({
  selector: 'app-setpoints',
  templateUrl: './setpoints.component.html',
  styleUrls: ['./setpoints.component.css'],
  providers: [ConnectionService]
})
export class SetpointsComponent implements OnInit {

  lineChartData: ChartConfiguration['data'] | undefined;

  hoursSelect: any;
  selectedData: any;
  selectedSetpoint: any;
  currHour: any;
  tempVal: any;
  setpointList: any;

  constructor(private connectionService: ConnectionService) {
  }

  ngOnInit() {
    this.connectionService.getSetpoints().subscribe(
      (data) => {
        this.setpointList = data;
        this.hoursSelect = data[0].Data.map(item => item.Hour);
      }
    );
  }


  refreshChart() {
    let hours = this.selectedData.map(item => item.Hour);
    let temperatures = this.selectedData.map(item => item.Temperature);

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

  selectionChanged(selectedSetpoint: String) {
    this.selectedSetpoint = selectedSetpoint['Setpoint'];
    this.selectedData = this.setpointList.find(item => item.Setpoint === this.selectedSetpoint)['Data']
    this.refreshChart();
  }

  changeSelectedHour(hourKey: String) {
    this.currHour = hourKey;
    this.tempVal = this.selectedData.find((data: { Hour: String, Temperature: number; }) => data.Hour === hourKey).Temperature;
  }

  updateChart() {
    this.selectedData.find((data: { Hour: String, Temperature: number; }) => data.Hour === this.currHour).Temperature = this.tempVal;
    this.setpointList.find(item => item.Setpoint === this.selectedSetpoint)['Data'] = this.selectedData
    this.refreshChart();
  }

  savePreset() {
    this.connectionService.postSetpoints(this.setpointList).subscribe();
  }

  tempChanged(temperature: number) {
    this.tempVal = temperature;
    this.selectedData.find((data: { Hour: String, Temperature: number; }) => data.Hour == this.currHour).Temperature = this.tempVal;
    this.updateChart();
  }

}
