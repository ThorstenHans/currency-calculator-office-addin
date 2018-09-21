import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExcelService } from '../../services/excel.service';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { ExchangeRate } from '../../models/exchange-rate';

@Component({
    selector: 'basta-root',
    templateUrl: './root.component.html',
})
export class RootComponent implements OnInit, OnDestroy {
    public exchangeRates: Array<ExchangeRate> = [];
    public selectedExchangeRate: ExchangeRate;
    public error: string;
    private _errorSubscription: Subscription;
    constructor(private readonly _exchangeRateService: ExchangeRateService, private readonly _excelService: ExcelService) {}

    public ngOnInit(): void {
        this._exchangeRateService.getCurrencies().subscribe(exrates => {
            this.exchangeRates = exrates;
        });

        interval(1000)
            .pipe(
                tap(() => {
                    if (this._excelService.error) {
                        this.error = JSON.stringify(this._excelService.error);
                    }
                })
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        if (!!this._errorSubscription) {
            this._errorSubscription.unsubscribe();
        }
    }

    public selectExchangeRate(exchangeRate: ExchangeRate): void {
        if (this.selectedExchangeRate === exchangeRate) {
            this.selectedExchangeRate = null;
        } else {
            this.selectedExchangeRate = exchangeRate;
        }
    }
    public sendSingle(): void {
        if (this.selectedExchangeRate) {
            this._excelService.sendExchangeRateToExcel(this.selectedExchangeRate);
        }
    }

    public sendAll(): void {
        this._excelService.sendExchangeRatesToExcel(this.exchangeRates);
    }

    public sortByCurrency(): void {
        this._excelService.sortExchangeRatesByCurrency();
    }

    public sortByValue(): void {
        this._excelService.sortExchangeRatesByValue();
    }

    public convert(): void {
        this._excelService.getCurrentSelection().subscribe(value => {
            const convertedValue = this._exchangeRateService.convert(+value, this.selectedExchangeRate);
            this._excelService.setValueBelowSelection(convertedValue);
        });
    }

    public createChart(): void {
        this._excelService.createChart();
    }
}
