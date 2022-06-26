import {Component, OnInit} from '@angular/core';
import {ChartConfiguration} from "chart.js";
import {ConnectionService} from "../connection/connection.service";

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css'],
  providers: [ConnectionService]
})
export class HistoricalComponent implements OnInit {

  lineChartData: ChartConfiguration['data'] | undefined;

  historicalDataList: any;
  currData: any;
  currKey: any;
  currParameters: any;

  volume: any;
  k_p: any;
  t_p: any;
  t_i: any;
  t_d: any;

  constructor(private connectionService: ConnectionService) {
  }

  ngOnInit(): void {
    this.connectionService.getHistorical().subscribe(
      (data) => {
        this.historicalDataList = data;
      }
    );
  }

  refreshChart() {
    this.volume = this.currParameters.v;
    this.k_p = this.currParameters.k_p;
    this.t_p = this.currParameters.t_p;
    this.t_i = this.currParameters.t_i;
    this.t_d = this.currParameters.t_d;

    let hours = this.currData.map(item => item.Hour);
    let temperatures = this.currData.map(item => item.Temperature);
    let setpoints = this.currData.map(item => item.Setpoint);
    let backgrounds = this.currData.map(item => item.Background);

    this.lineChartData = {
      datasets: [
        {
          stepped: true,
          data: temperatures,
          label: 'Temperature',
        },
        {
          stepped: true,
          data: setpoints,
          label: 'Setpoint temperature',
        },
        {
          stepped: true,
          data: backgrounds,
          label: 'Background temperature',
        },
      ],
      labels: hours //todo przypisz labele z backendu
    };
  }

  selectionChanged(historicalKey: any) {
    this.currKey = historicalKey['Date'];
    this.currData = this.historicalDataList.find(item => item.Date === this.currKey)['Data']
    this.currParameters = this.historicalDataList.find(item => item.Date === this.currKey)['Parameters']
    this.refreshChart();
  }
}
