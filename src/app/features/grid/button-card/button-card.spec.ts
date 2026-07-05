import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCard } from './button-card';

describe('ButtonCard', () => {
  let component: ButtonCard;
  let fixture: ComponentFixture<ButtonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
