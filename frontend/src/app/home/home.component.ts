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

  k_p = '0.0';
  t_p = '0.0';
  t_i = '0.0';
  t_d = '0.0';


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
  }

}
