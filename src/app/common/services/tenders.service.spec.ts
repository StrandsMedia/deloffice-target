import { TestBed } from '@angular/core/testing';

import { TendersService } from './tenders.service';

describe('TendersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TendersService = TestBed.get(TendersService);
    expect(service).toBeTruthy();
  });
});
