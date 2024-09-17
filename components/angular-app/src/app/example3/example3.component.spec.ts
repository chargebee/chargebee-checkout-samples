import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Example3Component } from './example3.component';

describe('Example1Component', () => {
  let component: Example3Component;
  let fixture: ComponentFixture<Example3Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Example3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Example3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
