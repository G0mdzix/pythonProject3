import {Component, OnInit, ViewChild} from '@angular/core';
import {backgroundTemperatures, dummySetpointList, exampleSimulation} from "../../assets/dummyData";
import {ChartConfiguration, ChartDataset} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {ConnectionService} from "../connection/connection.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ConnectionService]
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
  setpointList: any
  backgroundTemperatures: any;
  dummyResponse = exampleSimulation;
  simulationTemperatures: any;

  constructor(private connectionService: ConnectionService) {
  }

  ngOnInit(): void {

    this.connectionService.getBackground().subscribe(
      (data) => {
        this.backgroundTemperatures = data;
      }
    );

    this.connectionService.getSetpoints().subscribe(
      (data) => {
        this.setpointList = data;
      }
    );

    this.lineChartData = {
      datasets: [
        {
          stepped: true,
          data: null,
          label: 'Please select preset first',
        },
      ],
      labels: null
    };
  }

  setpointSelectionChanged(selectedSetpoint: any) {
    this.selectedSetpoint = selectedSetpoint;

    let setpointTemperatures = this.selectedSetpoint.Data.map(item => item.Temperature);
    let temperatures = this.backgroundTemperatures.map(item => item.Temperature);
    let hours = this.backgroundTemperatures.map(item => item.Hour);

    this.lineChartData = {
      datasets: [
        {
          stepped: true,
          data: temperatures,
          label: 'Background temperature',
        },
        {
          stepped: true,
          data: setpointTemperatures,
          label: this.selectedSetpoint.Setpoint + ' temperature',
        },
      ],
      labels: hours
    };

  }

  async runSimulation(): Promise<void> {
    this.connectionService.runSimulation(this.selectedSetpoint, this.volume, this.k_p, this.t_p, this.t_i, this.t_d);
    this.simulationTemperatures = this.connectionService.simulation;

    let simulationTemperatures = this.simulationTemperatures.map(item => item.Temperature);

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
