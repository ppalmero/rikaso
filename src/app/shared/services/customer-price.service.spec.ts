import { TestBed } from '@angular/core/testing';

import { CustomerPriceService } from './customer-price.service';

describe('CustomerPriceService', () => {
  let service: CustomerPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
