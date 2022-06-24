import {Component, OnInit} from '@angular/core';
import {dummyHistoricalDatas} from "../../assets/dummyData";
import {ChartConfiguration} from "chart.js";

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css']
})
export class HistoricalComponent implements OnInit {

  lineChartData: ChartConfiguration['data'] | undefined;

  isSelected = false;
  historicalDataList = dummyHistoricalDatas;
  currData: any;
  currKey: any;

  volume: any;
  k_p: any;
  t_p: any;
  t_i: any;
  t_d: any;

  constructor() {
  }

  ngOnInit(): void {
    //todo odczytaj historyczne symulacje
  }

  refreshChart() {

    this.volume = this.currData[0].v;
    this.k_p = this.currData[0].k_p
    this.t_p = this.currData[0].t_p;
    this.t_i = this.currData[0].t_i;
    this.t_d = this.currData[0].t_d;


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
    this.isSelected = true;
    this.currKey = historicalKey;
    this.currData = this.historicalDataList.get(this.currKey);
    this.refreshChart();
  }
}
