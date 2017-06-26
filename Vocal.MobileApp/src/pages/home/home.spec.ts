import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController } from "ionic-angular";
import { HomePage } from "./home";

describe("HomePage", () => {
    let comp: HomePage;
    let fixture: ComponentFixture<HomePage>;

    beforeEach(() => {
        const navControllerStub = {};
        TestBed.configureTestingModule({
            declarations: [ HomePage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NavController, useValue: navControllerStub }
            ]
        });
        fixture = TestBed.createComponent(HomePage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

});
