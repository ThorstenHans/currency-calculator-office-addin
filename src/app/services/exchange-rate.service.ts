import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ExchangeRatesResponse } from '../models/exchange-rates.response';
import { ExchangeRate } from '../models/exchange-rate';

@Injectable()
export class ExchangeRateService {
    constructor(private readonly _http: HttpClient) { }

    public getCurrencies(): Observable<Array<ExchangeRate>> {
        return this._http.get<ExchangeRatesResponse>(environment.currencyApiRoot).pipe(
            map(response => {
                return Object.keys(response.rates)
                    .map(key => {
                        return {
                            name: key,
                            value: +response.rates[key],
                        } as ExchangeRate;
                    })
                    .filter(er => er.value < 50);
            })
        );
    }

    public convert(input: number, exchangeRate: ExchangeRate): number {
        if (exchangeRate) {
            return input * exchangeRate.value;
        }
        return 0;
    }
}
