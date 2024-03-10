import { AfterViewInit, ViewContainerRef, TemplateRef, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { JoyrideStepsContainerService } from '../services/joyride-steps-container.service';
import { Router } from '@angular/router';
import { DomRefService } from '../services/dom.service';
import { TemplatesService } from '../services/templates.service';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare const NO_POSITION = "NO_POSITION";
export declare class JoyrideDirective implements AfterViewInit, OnChanges, OnDestroy {
    private readonly joyrideStepsContainer;
    private viewContainerRef;
    private readonly domService;
    private readonly router;
    private readonly templateService;
    private platformId;
    name: string;
    nextStep?: string;
    title?: string | Observable<string>;
    text?: string | Observable<string>;
    stepPosition?: string;
    stepContent?: TemplateRef<any>;
    stepContentParams?: Object;
    prevTemplate?: TemplateRef<any>;
    nextTemplate?: TemplateRef<any>;
    doneTemplate?: TemplateRef<any>;
    counterTemplate?: TemplateRef<any>;
    prev?: EventEmitter<any>;
    next?: EventEmitter<any>;
    done?: EventEmitter<any>;
    private windowRef;
    private step;
    private subscriptions;
    constructor(joyrideStepsContainer: JoyrideStepsContainerService, viewContainerRef: ViewContainerRef, domService: DomRefService, router: Router, templateService: TemplatesService, platformId: Object);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private isElementFixed;
    private setAsyncFields;
    private isAncestorsFixed;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JoyrideDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<JoyrideDirective, "joyrideStep, [joyrideStep]", never, { "name": "joyrideStep"; "nextStep": "nextStep"; "title": "title"; "text": "text"; "stepPosition": "stepPosition"; "stepContent": "stepContent"; "stepContentParams": "stepContentParams"; "prevTemplate": "prevTemplate"; "nextTemplate": "nextTemplate"; "doneTemplate": "doneTemplate"; "counterTemplate": "counterTemplate"; }, { "prev": "prev"; "next": "next"; "done": "done"; }, never>;
}
