import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PasswordForgotComponent } from "./passwordForgot.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("PasswordForgotComponent", () => {

  let fixture: ComponentFixture<PasswordForgotComponent>;
  let component: PasswordForgotComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PasswordForgotComponent]
    });

    fixture = TestBed.createComponent(PasswordForgotComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
