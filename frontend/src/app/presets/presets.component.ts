import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {dummyPresetList, hours} from "../../assets/dummyData";
import {IgxCategoryChartComponent} from "igniteui-angular-charts";

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.css']
})
export class PresetsComponent implements OnInit {
  isSelected = false;
  selectedPreset: any;
  hoursSelect = hours;
  presetList = dummyPresetList;
  currData: any;
  currKey: any;
  currHour: any;
  editPreset = false;
  tempVal: any;


  constructor() {
  }

  ngOnInit() {
    //todo załadować presety z backendu
    this.currData = this.presetList.get('Preset 1');
  }


  selectionChanged(presetKey: String) {
    this.isSelected = true;
    this.currKey = presetKey;
    this.currData = this.presetList.get(this.currKey);

  }

  toggleEditPreset() {
    this.editPreset = true;
  }

  changeSelectedHour(hourKey: String) {
    this.currHour = hourKey;
    this.tempVal = this.currData.find((data: { Hour: String, Temperature: number; }) => data.Hour == hourKey).Temperature;
  }

  dupa() {

  }

}
