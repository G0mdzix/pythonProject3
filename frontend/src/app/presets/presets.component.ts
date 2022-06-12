import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.css']
})
export class PresetsComponent implements OnInit {
  presetList = ['Preset 1', 'Preset 2', 'Preset 3'];

  dummyData = [
    {Hour: "00:00", Temperature: 20},
    {Hour: "00:30", Temperature: 20},
    {Hour: "01:00", Temperature: 20},
    {Hour: "01:30", Temperature: 20},
    {Hour: "02:00", Temperature: 20},
    {Hour: "02:30", Temperature: 20},
    {Hour: "03:00", Temperature: 20},
    {Hour: "03:30", Temperature: 20},
    {Hour: "04:00", Temperature: 20},
    {Hour: "04:30", Temperature: 20},
    {Hour: "05:00", Temperature: 20},
    {Hour: "05:30", Temperature: 20},
    {Hour: "06:00", Temperature: 20},
    {Hour: "06:30", Temperature: 20},
    {Hour: "07:00", Temperature: 20},
    {Hour: "07:30", Temperature: 20},
    {Hour: "08:00", Temperature: 20},
    {Hour: "08:30", Temperature: 20},
    {Hour: "09:00", Temperature: 20},
    {Hour: "09:30", Temperature: 20},
    {Hour: "10:00", Temperature: 20},
    {Hour: "10:30", Temperature: 20},
    {Hour: "11:00", Temperature: 20},
    {Hour: "11:30", Temperature: 20},
    {Hour: "12:00", Temperature: 20},
    {Hour: "12:30", Temperature: 20},
    {Hour: "13:00", Temperature: 20},
    {Hour: "13:30", Temperature: 20},
    {Hour: "14:00", Temperature: 20},
    {Hour: "14:30", Temperature: 20},
    {Hour: "15:00", Temperature: 20},
    {Hour: "15:30", Temperature: 20},
    {Hour: "16:00", Temperature: 20},
    {Hour: "16:30", Temperature: 20},
    {Hour: "17:00", Temperature: 20},
    {Hour: "17:30", Temperature: 20},
    {Hour: "18:00", Temperature: 20},
    {Hour: "18:30", Temperature: 20},
    {Hour: "19:00", Temperature: 20},
    {Hour: "19:30", Temperature: 20},
    {Hour: "20:00", Temperature: 20},
    {Hour: "20:30", Temperature: 20},
    {Hour: "21:00", Temperature: 20},
    {Hour: "21:30", Temperature: 20},
    {Hour: "22:00", Temperature: 20},
    {Hour: "22:30", Temperature: 20},
    {Hour: "23:00", Temperature: 20},
    {Hour: "23:30", Temperature: 20},
  ];

  isSelected = false;
  selectedPreset: any;

  constructor() {
  }

  ngOnInit() {
    //todo załadować presety
    // this.dummyData.find('12:30')
    // updateItem(item)
    // {
      this.dummyData[24].Temperature=30;
    //}
  }

  selectionChanged() {
    //todo załadować dane presetu
    debugger;
    this.isSelected = !this.isSelected;


  }

}
