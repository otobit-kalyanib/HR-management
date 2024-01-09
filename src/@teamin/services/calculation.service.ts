import { Injectable, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from './api.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  public APIUrl: string = environment.baseURL;
  @Input() cn: string
  constructor(
    private dialog: MatDialog,
    public _APIService: APIService
  ) { }


  //Gross Amount = Quantity * UnitrateBeforTax
  getGrossAmount(Quantity, UnitRateBeforeTax) {
    var grossAmount: number = 0;

    grossAmount = Number(Quantity) * Number(UnitRateBeforeTax)

    return (Math.round(grossAmount * 100)/100).toFixed(2);
  }

  //Taxable Amount = Gross Amount - Discount
  getTaxableAmount(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount) {
    grossAmount = this.getGrossAmount(Quantity, UnitRateBeforeTax);
    var total: number = 0;
    if (DiscountTypeId) {
      switch (Text) {
        case 'Amount':
          total = Number(grossAmount) - Number(Discount);
          break;

        case 'Percentage':
          total = Number(grossAmount) - ((Number(grossAmount) * Number(Discount)) / 100);
          break;

        case 'Quantity':
          total = Number(grossAmount) - (Number(UnitRateBeforeTax) * Number(Discount))
          break;
      }
    }
    else {
      total = Number(this.getGrossAmount(Quantity, UnitRateBeforeTax))
    }

    return (Math.round(total * 100)/100).toFixed(2);
  }

  //Tax Amount = (Tax Percentage * Taxable Amount) / 100
  getTaxAmount(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, percentage) {
    var rate: number = 0;
    var amount: number = 0;

    rate = (Number(percentage) * Number(this.getTaxableAmount(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount))) / 100

    return (Math.round(rate * 100)/100).toFixed(2);
  }

  //Sum of all tax percentage
  getTotalTaxPercentage(TaxLedgersArray) {
    var totalTax: number = 0;

    TaxLedgersArray.forEach((element) => {
      if (element.TaxLedger?.Percentage) {
        totalTax += Number(element.TaxLedger.Percentage)
      }
    })

    return (Math.round(totalTax * 100)/100).toFixed(2);
  }

  //Sum of all tax amount
  getTotalTaxAmount(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray) {
    var amount: number = 0;

    amount = Number(this.getTotalTax(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray))

    return (Math.round(amount * 100)/100).toFixed(2);
  }

  //Total Tax Apply on Item
  getTotalTax(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray) {
    var tax: number = 0;
    var TaxableAmount: number = 0;
    var TotalTaxPercentage: number = 0;

    TaxableAmount = Number(this.getTaxableAmount(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount))
    TotalTaxPercentage = Number(this.getTotalTaxPercentage(TaxLedgersArray))

    tax = (Number(TaxableAmount) * Number(TotalTaxPercentage)) / 100

    return (Math.round(tax * 100)/100).toFixed(2);
  }

  //Unit Rate After Tax or Per Quantity Unit Rate
  getUnitRatePerQty(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray) {
    var unitRate: number = 0;

    unitRate = Number(this.ItemsTotal(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray)) / Number(Quantity)

    return (Math.round(unitRate * 100)/100).toFixed(2);
  }

  //Item Total = Final Amount (Discount, Tax, etc are Applied)
  ItemsTotal(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray) {
    var totalAmount: number = 0;

    totalAmount = Number(this.getTaxableAmount(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount)) + Number(this.getTotalTax(Quantity, UnitRateBeforeTax, grossAmount, DiscountTypeId, Text, Discount, TaxLedgersArray))

    return (Math.round(totalAmount * 100)/100).toFixed(2);
  }

  //Sum of Taxable Amount of all Items
  getTotalTaxableAmount(array) {
    var total: number = 0;

    array.forEach(element => {
      if (element.TaxableAmount) {
        total += Number(element.TaxableAmount);
      }
    });

    return (Math.round(total * 100)/100).toFixed(2);
  }

  //Sum of Item Total of All Items(Before TCS/TDS)
  getTotalAmount(array) {
    var totalAmount: number = 0;

    array.forEach(element => {
      if (element.TotalAmount) {
        totalAmount += Number(element.TotalAmount);
      }
    })

    return (Math.round(totalAmount * 100)/100).toFixed(2);
  }

  //TCS TDS Tax Amount
  getTCSTDSTax(TaxdetailArray, array) {
    var TCSTDSTax: number = 0;

    TaxdetailArray.forEach((element) => {
      if(element.IsSelected === true){
        if (element.TaxLedger.Id) {
          TCSTDSTax = (Number(this.getTotalTaxableAmount(array)) * Number(element.TaxLedger?.Percentage)) / 100;
        }
        else{
          return TCSTDSTax;
        }
      }
    })

    return (Math.round(TCSTDSTax * 100)/100).toFixed(2);
  }

  //Total after applied TCS TDS Tax Amount
  getTCSTDSTotalAmount(TaxdetailArray, array) {
    var total: number = 0;

    TaxdetailArray.forEach((element) => {
      if (element.IsSelected == true) {
        if (element.TaxType?.Id == 2801) {
          total = Number(this.getTotalAmount(array)) - Number(element.TaxAmount)
        }
        else if (element.TaxType?.Id == 2802) {
          total = Number(this.getTotalAmount(array)) + Number(element.TaxAmount)
        }
      }
    })

    return (Math.round(total * 100)/100).toFixed(2);
  }

  //Indirect Ledger Total
  getIndirectLedgerTotal(indirectLedgerArray) {
    var indirectLedger: number = 0;

    indirectLedgerArray.forEach(element => {
      if (element.Amount) {
        if (element.IsCredit) {
          indirectLedger += Number(element.Amount);
        }
        else {
          indirectLedger -= Number(element.Amount);
        }
      }
    })

    return (Math.round(indirectLedger * 100)/100).toFixed(2);
  }

  //Grand Total = Final Total(Indirect Ledger , TCS TDS Applied)
  getGrandTotal(TaxdetailArray, array, indirectLedgerArray) {
    var grandTotal: number = 0;

    grandTotal = Number(this.getTCSTDSTotalAmount(TaxdetailArray, array)) + Number(this.getIndirectLedgerTotal(indirectLedgerArray))

    return (Math.round(grandTotal * 100)/100).toFixed(2);
  }
}