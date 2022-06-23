import {Component, OnInit} from '@angular/core';
import {dummyPresetList} from "../../assets/dummyData";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  volume = '1.5'
  k_p = '1.0';
  t_p = '2.0';
  t_i = '3.0';
  t_d = '4.0';

  setpoint: any;
  presetList = dummyPresetList;

  constructor() {
  }

  ngOnInit(): void {
  }

  setpointSelectionChanged(setpoint: String) {
    this.setpoint = setpoint;
    //this.currData = this.presetList.get(this.currKey);
    //this.refreshChart();
  }

  runSimulation(): void {

  }

}
