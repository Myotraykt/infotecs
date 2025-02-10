import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  private units: string[] = ['г', 'кг', 'мл', 'л', 'шт.', 'ст.л.', 'ч.л.'];

  getUnits(): string[] {
    return this.units;
  }
}
