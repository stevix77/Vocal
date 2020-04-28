import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PasswordForgotPage } from './password-forgot.page';

describe('PasswordForgotPage', () => {
  let component: PasswordForgotPage;
  let fixture: ComponentFixture<PasswordForgotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordForgotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordForgotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
