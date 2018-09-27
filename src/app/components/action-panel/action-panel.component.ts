import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'basta-action-panel',
    templateUrl: './action-panel.component.html',
})
export class ActionPanelComponent {
    @Output()
    public sendSingle = new EventEmitter<void>();
    @Output()
    public sendAll = new EventEmitter<void>();

    @Output()
    public sortByCurrency = new EventEmitter<void>();
    @Output()
    public sortByValue = new EventEmitter<void>();

    @Output()
    public convert = new EventEmitter<void>();

    @Output()
    public createChart = new EventEmitter<void>();

    public sendSelectedExchangeRateToExcel(): void {
        this.sendSingle.next();
    }

    public sendAllExchangeRatesToExcel(): void {
        this.sendAll.next();
    }

    public sortExchangeRatesByCurrency(): void {
        this.sortByCurrency.next();
    }

    public sortExchangeRatesByValue(): void {
        this.sortByValue.next();
    }

    public convertToSelectedCurrency(): void {
        this.convert.next();
    }

    public createChartForExchangeRates(): void {
        this.createChart.next();
    }
}
