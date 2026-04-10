import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationCommon } from './pagination-common';

describe('PaginationCommon', () => {
  let component: PaginationCommon;
  let fixture: ComponentFixture<PaginationCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationCommon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationCommon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
