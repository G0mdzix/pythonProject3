import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PresetsComponent} from "./presets/presets.component";
import {HistoricComponent} from "./historic/historic.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'presets', component: PresetsComponent},
  {path: 'historic', component: HistoricComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
