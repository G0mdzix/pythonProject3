import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class ConnectionService {

  API_URL = 'http://127.0.0.1:8000/';
  simulation: Object;

  constructor(private http: HttpClient) {
  }

  getSetpoints() {
    return this.http.get(this.API_URL + 'setpoints');
  }

  postSetpoints(setpointList: any) {
    return this.http.post(this.API_URL + 'setpoints', JSON.stringify(setpointList));
  }

  getHistorical() {
    return this.http.get(this.API_URL + 'historical');
  }

  getBackground() {
    return this.http.get(this.API_URL + 'background');
  }

  runSimulation(selectedSetpoint: any, v: number, k_p: number, t_p: number, t_i: number, t_d: number) {
    debugger;
    let params = {
      "setpoint": selectedSetpoint.Data.map(item => item.Temperature),
      "v": v,
      "k_p": k_p,
      "t_p": t_p,
      "t_i": t_i,
      "t_d": t_d
    }
    return this.http.put(this.API_URL, params);
  }
}
