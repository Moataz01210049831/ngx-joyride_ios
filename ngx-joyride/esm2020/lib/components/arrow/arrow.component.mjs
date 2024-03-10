import { Component, Input, ViewEncapsulation } from "@angular/core";
import * as i0 from "@angular/core";
export class JoyrideArrowComponent {
    constructor() {
        this.position = 'top';
    }
}
JoyrideArrowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideArrowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
JoyrideArrowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.1", type: JoyrideArrowComponent, selector: "joyride-arrow", inputs: { position: "position" }, ngImport: i0, template: "<div [class.joyride-arrow__top]=\"position == 'top'\"\n     [class.joyride-arrow__bottom]=\"position == 'bottom'\"\n     [class.joyride-arrow__left]=\"position == 'left'\"\n     [class.joyride-arrow__right]=\"position == 'right'\">\n</div>", styles: [".joyride-arrow__top{border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:11px solid #ffffff}.joyride-arrow__bottom{border-left:11px solid transparent;border-right:11px solid transparent;border-top:11px solid #ffffff}.joyride-arrow__right{border-left:11px solid #ffffff;border-bottom:11px solid transparent;border-top:11px solid transparent}.joyride-arrow__left{border-right:11px solid #ffffff;border-top:11px solid transparent;border-bottom:11px solid transparent}\n"], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideArrowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'joyride-arrow', encapsulation: ViewEncapsulation.None, template: "<div [class.joyride-arrow__top]=\"position == 'top'\"\n     [class.joyride-arrow__bottom]=\"position == 'bottom'\"\n     [class.joyride-arrow__left]=\"position == 'left'\"\n     [class.joyride-arrow__right]=\"position == 'right'\">\n</div>", styles: [".joyride-arrow__top{border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:11px solid #ffffff}.joyride-arrow__bottom{border-left:11px solid transparent;border-right:11px solid transparent;border-top:11px solid #ffffff}.joyride-arrow__right{border-left:11px solid #ffffff;border-bottom:11px solid transparent;border-top:11px solid transparent}.joyride-arrow__left{border-right:11px solid #ffffff;border-top:11px solid transparent;border-bottom:11px solid transparent}\n"] }]
        }], propDecorators: { position: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWpveXJpZGUvc3JjL2xpYi9jb21wb25lbnRzL2Fycm93L2Fycm93LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1qb3lyaWRlL3NyYy9saWIvY29tcG9uZW50cy9hcnJvdy9hcnJvdy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFRcEUsTUFBTSxPQUFPLHFCQUFxQjtJQU5sQztRQVFJLGFBQVEsR0FBVyxLQUFLLENBQUM7S0FDNUI7O2tIQUhZLHFCQUFxQjtzR0FBckIscUJBQXFCLHVGQ1RsQyxpUEFJTTsyRkRLTyxxQkFBcUI7a0JBTmpDLFNBQVM7K0JBQ0ksZUFBZSxpQkFHVixpQkFBaUIsQ0FBQyxJQUFJOzhCQUlyQyxRQUFRO3NCQURQLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdqb3lyaWRlLWFycm93JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXJyb3cuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2Fycm93LmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBKb3lyaWRlQXJyb3dDb21wb25lbnQge1xuICAgIEBJbnB1dCgpXG4gICAgcG9zaXRpb246IHN0cmluZyA9ICd0b3AnO1xufSIsIjxkaXYgW2NsYXNzLmpveXJpZGUtYXJyb3dfX3RvcF09XCJwb3NpdGlvbiA9PSAndG9wJ1wiXG4gICAgIFtjbGFzcy5qb3lyaWRlLWFycm93X19ib3R0b21dPVwicG9zaXRpb24gPT0gJ2JvdHRvbSdcIlxuICAgICBbY2xhc3Muam95cmlkZS1hcnJvd19fbGVmdF09XCJwb3NpdGlvbiA9PSAnbGVmdCdcIlxuICAgICBbY2xhc3Muam95cmlkZS1hcnJvd19fcmlnaHRdPVwicG9zaXRpb24gPT0gJ3JpZ2h0J1wiPlxuPC9kaXY+Il19