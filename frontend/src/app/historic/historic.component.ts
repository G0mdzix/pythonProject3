import {Component, OnInit} from '@angular/core';
import {dummyHistoricDatas} from "../../assets/dummyData";
import {ChartConfiguration} from "chart.js";

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.css']
})
export class HistoricComponent implements OnInit {

  lineChartData: ChartConfiguration['data'] | undefined;

  isSelected = false;
  historicDataList = dummyHistoricDatas;
  currData: any;
  currKey: any;

  constructor() {
  }

  ngOnInit(): void {
    debugger;
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

  selectionChanged(historicKey: any) {
    this.isSelected = true;
    this.currKey = historicKey;
    this.currData = this.historicDataList.get(this.currKey);
    this.refreshChart();
  }
}
