import {Component, OnInit, ViewChild} from '@angular/core';
import {backgroundTemperatures, dummySetpointList, exampleSimulation} from "../../assets/dummyData";
import {ChartConfiguration, ChartDataset} from "chart.js";
import {hours} from "../../assets/hours";
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  lineChartData: ChartConfiguration['data'] | undefined;

  volume = '1.5'
  k_p = '1.0'; //todo jakie domyślne nastawy regulatora?
  t_p = '2.0';
  t_i = '3.0';
  t_d = '4.0';

  selectedSetpoint: any;
  presetList = dummySetpointList;
  backgroundTemperatures = backgroundTemperatures;
  dummyResponse = exampleSimulation;

  constructor() {
  }

  ngOnInit(): void {
    //todo załaduj dane o tle
    //todo załąduj dostępne presety

    let temperatures = this.backgroundTemperatures.map(item => item.Temperature);

    this.lineChartData = {
      datasets: [
        {
          stepped: true,
          data: temperatures,
          label: 'Background temperature',
        },
      ],
      labels: hours
    };
  }

  setpointSelectionChanged(selectedSetpoint: String) {
    this.selectedSetpoint = selectedSetpoint;

    let setpointTemperatures = this.presetList.get(this.selectedSetpoint).map(item => item.Temperature);

    let newData: ChartDataset<'line'> = {
      stepped: true,
      data: setpointTemperatures,
      label: this.selectedSetpoint + ' temperature',
    }

    if (this.lineChartData?.datasets[1]) {
      // @ts-ignore
      this.lineChartData?.datasets[1] = newData;
    } else {
      this.lineChartData?.datasets.push(newData);
    }

    if (this.lineChartData?.datasets[2]) {
      // @ts-ignore
      this.lineChartData?.datasets[2].hidden = true;
    }

    this.chart.chart?.update();
  }

  runSimulation(): void {
    //todo odbierz dane

    let simulationTemperatures = this.dummyResponse.map(item => item.Temperature);

    let newData: ChartDataset<'line'> = {
      stepped: true,
      data: simulationTemperatures,
      label: 'Temperature',
    }

    if (this.lineChartData?.datasets[2]) {
      // @ts-ignore
      this.lineChartData?.datasets[2] = newData;
    } else {
      this.lineChartData?.datasets.push(newData);
    }

    this.chart.chart?.update();
  }
}
