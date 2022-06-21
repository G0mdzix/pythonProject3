import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currTime: string | undefined;

  pid = false;
  editPid = false;


  its1 = '-77';
  its2 = '-77';
  eaa = '-77';
  inTemp = '20';

  k_p = '1.0';
  t_p = '2.0';
  t_i = '3.0';
  t_d = '4.0';
  volume = '1.5'

  constructor() {
    setInterval(() => {
      this.currTime = new Date().toString().split(' ')[4];
    }, 1);
  }

  ngOnInit(): void {
  }

  refresh(): void {
    //todo
  }

  togglePid(): void {
    this.pid = !this.pid;
  }

  toggleEditPid(): void {
    this.editPid = !this.editPid;
  }

  sendPidSettings(): void {
    //todo
    debugger;
    this.toggleEditPid();

  }

}
