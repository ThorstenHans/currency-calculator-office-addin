import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RootComponent } from './components/root/root.component';

import { ActionPanelComponent } from './components/action-panel/action-panel.component';

import { ExcelService } from './services/excel.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ExchangeRateListComponent } from './components/exchange-rate-list/exchange-rate-list.component';
import { ExchangeRateService } from './services/exchange-rate.service';

@NgModule({
    declarations: [RootComponent, ExchangeRateListComponent, ActionPanelComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, ExchangeRateService, ExcelService],
    bootstrap: [RootComponent],
})
export class AppModule {}
