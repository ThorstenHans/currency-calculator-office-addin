import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ExchangeRate } from '../../models/exchange-rate';

@Component({
    selector: 'basta-exchange-rate-list',
    templateUrl: './exchange-rate-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRateListComponent {
    @Input()
    public exchangeRates: Array<ExchangeRate>;
    @Input()
    public selected: ExchangeRate;
    @Output()
    public selectExchangeRate = new EventEmitter<ExchangeRate>();
    constructor() {}

    public select(exchangeRate: ExchangeRate) {
        this.selectExchangeRate.next(exchangeRate);
    }
}
