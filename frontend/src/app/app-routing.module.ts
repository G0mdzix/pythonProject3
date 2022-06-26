import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SetpointsComponent} from "./setpoints/setpoints.component";
import {HistoricalComponent} from "./historical/historical.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'setpoints', component: SetpointsComponent},
  {path: 'historical', component: HistoricalComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
