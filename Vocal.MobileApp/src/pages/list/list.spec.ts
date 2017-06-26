import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { ListPage } from "./list";

describe("ListPage", () => {
    let comp: ListPage;
    let fixture: ComponentFixture<ListPage>;

    beforeEach(() => {
        const navControllerStub = {
            push: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ ListPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub }
            ]
        });
        fixture = TestBed.createComponent(ListPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

});
