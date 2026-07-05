import { TestBed } from '@angular/core/testing';

import { Button } from './button';

describe('Button', () => {
  let service: Button;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Button);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
