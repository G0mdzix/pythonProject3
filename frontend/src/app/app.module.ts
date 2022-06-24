import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {PresetsComponent} from './presets/presets.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {IgxCategoryChartModule} from "igniteui-angular-charts";
import {MatInputModule} from "@angular/material/input";
import {NgChartsModule} from 'ng2-charts';
import {HistoricalComponent} from './historical/historical.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PresetsComponent,
    HistoricalComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    IgxCategoryChartModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
