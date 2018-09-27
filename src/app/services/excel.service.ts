import { Injectable } from '@angular/core';
import { ExchangeRate } from '../models/exchange-rate';
import { Observable } from 'rxjs';

declare var Excel: any;
@Injectable()
export class ExcelService {
    constructor() { }

    public error: any;

    public sendExchangeRateToExcel(exchangeRate: ExchangeRate): void {
        Excel.run(async ctx => {
            const range = ctx.workbook.getSelectedRange();
            range.values = [[exchangeRate.value]];
            await ctx.sync();
        });
    }

    public sortExchangeRatesByCurrency(): void {
        Excel.run(async ctx => {
            const worksheetName = 'Exchange Rates';
            const currenciesWorksheet = ctx.workbook.worksheets.getItem(worksheetName);
            const table = currenciesWorksheet.tables.getItemAt(0);
            table.sort.apply([{ key: 0, ascending: true }]);
            await ctx.sync();
        }).catch(err => (this.error = err));
    }

    public sortExchangeRatesByValue(): void {
        Excel.run(async ctx => {
            const worksheetName = 'Exchange Rates';
            const currenciesWorksheet = ctx.workbook.worksheets.getItem(worksheetName);
            const table = currenciesWorksheet.tables.getItemAt(0);
            table.sort.apply([{ key: 1, ascending: true }]);
            await ctx.sync();
        }).catch(err => (this.error = err));
    }

    public sendExchangeRatesToExcel(exchangeRates: Array<ExchangeRate>): void {
        Excel.run(async ctx => {
            const worksheetName = 'Exchange Rates';
            const existing = ctx.workbook.worksheets.getItemOrNullObject(worksheetName);
            if (existing) {
                existing.delete();
            }

            const currenciesWorksheet = ctx.workbook.worksheets.add(worksheetName);
            const currenciesTable = currenciesWorksheet.tables.add('A1:B1', true);
            currenciesTable.name = 'ExchangeRates';

            currenciesTable.getHeaderRowRange().values = [['Currency', 'Value']];
            const data: Array<any> = exchangeRates.map(ex => [ex.name, ex.value]);

            currenciesTable.rows.add(null, data);
            currenciesTable.getRange().format.autofitColumns();
            currenciesTable.getRange().format.autofitRows();
            await ctx.sync();
        }).catch(err => {
            this.error = err;
        });
    }

    public createChart() {
        Excel.run(async ctx => {
            const dataWorksheetName = 'Exchange Rates';
            const dataTableName = 'ExchangeRates';

            const currentWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
            const dataWorksheet = ctx.workbook.worksheets.getItem(dataWorksheetName);
            const dataTable = dataWorksheet.tables.getItem(dataTableName);
            const dataRange = dataTable.getDataBodyRange();
            const chart = currentWorksheet.charts.add('ColumnClustered', dataRange, 'Auto');
            chart.setPosition('B15', 'R49');
            chart.title.text = 'Exchange Rates';
            chart.legend.position = 'Bottom';
            chart.legend.format.fill.setSolidColor('white');
            chart.dataLabels.format.font.size = 14;
            chart.dataLabels.format.font.color = 'black';
            chart.series.getItemAt(0).name = 'Value in Euro';
            await ctx.sync();
        }).catch(err => (this.error = err));
    }

    public getCurrentSelection(): Observable<any> {
        return Observable.create(observer => {
            Excel.run(async ctx => {
                const range = ctx.workbook.getSelectedRange();
                range.load('values');
                await ctx.sync().then(
                    () => {
                        observer.next(range.values[0][0]);
                        observer.complete();
                    },
                    err => {
                        observer.error(err);
                    }
                );
            }).catch(err => (this.error = err));
        });
    }

    public setValueBelowSelection(value: string | boolean | number) {
        Excel.run(async ctx => {
            const range = ctx.workbook.getSelectedRange();
            range.load('rowIndex, columnIndex');
            await ctx.sync().then(async () => {
                const target = ctx.workbook.worksheets.getActiveWorksheet().getCell(range.rowIndex + 1, range.columnIndex);
                target.values = [[value]];

                await ctx.sync();
            });
        }).catch(err => (this.error = err));
    }
}
