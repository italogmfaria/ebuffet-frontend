import { TestBed } from '@angular/core/testing';

import { BuffetService } from './buffet.service';

describe('BuffetService', () => {
  let service: BuffetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuffetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
