import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DomRefService } from './dom.service';
import { isPlatformBrowser } from "@angular/common";
export class DocumentService {
    constructor(DOMService, platformId) {
        this.DOMService = DOMService;
        if (!isPlatformBrowser(platformId)) {
            return;
        }
        this.setDocumentHeight();
        var doc = DOMService.getNativeDocument();
        if (doc && !doc.elementsFromPoint) {
            // IE 11 - Edge browsers
            doc.elementsFromPoint = this.elementsFromPoint.bind(this);
        }
    }
    getElementFixedTop(elementRef) {
        const scrollOffsets = this.getScrollOffsets();
        return (elementRef.nativeElement.getBoundingClientRect().top +
            scrollOffsets.y);
    }
    getElementFixedLeft(elementRef) {
        return elementRef.nativeElement.getBoundingClientRect().left;
    }
    getElementAbsoluteTop(elementRef) {
        const scrollOffsets = this.getScrollOffsets();
        return (elementRef.nativeElement.getBoundingClientRect().top +
            scrollOffsets.y);

            
    }
    getElementAbsoluteLeft(elementRef) {
        const scrollOffsets = this.getScrollOffsets();
        return (elementRef.nativeElement.getBoundingClientRect().left +
            scrollOffsets.x);
    }
    setDocumentHeight() {
        this.documentHeight = this.calculateDocumentHeight();
    }
    getDocumentHeight() {
        return this.documentHeight;
    }
    isParentScrollable(elementRef) {
        return (this.getFirstScrollableParent(elementRef.nativeElement) !==
            this.DOMService.getNativeDocument().body);
    }
    isElementBeyondOthers(elementRef, isElementFixed, keywordToDiscard) {
        const x1 = isElementFixed
            ? this.getElementFixedLeft(elementRef)
            : this.getElementAbsoluteLeft(elementRef);
        const y1 = isElementFixed
            ? this.getElementAbsoluteTop(elementRef)
            : this.getElementAbsoluteTop(elementRef);
        const x2 = x1 + elementRef.nativeElement.getBoundingClientRect().width - 1;
        const y2 = y1 + elementRef.nativeElement.getBoundingClientRect().height - 1;
        const elements1 = this.DOMService.getNativeDocument().elementsFromPoint(x1, y1);
        const elements2 = this.DOMService.getNativeDocument().elementsFromPoint(x2, y2);
        if (elements1.length === 0 && elements2.length === 0)
            return 1;
        if (this.getFirstElementWithoutKeyword(elements1, keywordToDiscard) !==
            elementRef.nativeElement ||
            this.getFirstElementWithoutKeyword(elements2, keywordToDiscard) !==
                elementRef.nativeElement) {
            return 2;
        }
        return 3;
    }
    scrollIntoView(elementRef, isElementFixed) {
        const firstScrollableParent = this.getFirstScrollableParent(elementRef.nativeElement);
        const top = isElementFixed
            ? this.getElementAbsoluteTop(elementRef)
            : this.getElementAbsoluteTop(elementRef);
        if (firstScrollableParent !== this.DOMService.getNativeDocument().body) {
            if (firstScrollableParent.scrollTo) {
                firstScrollableParent.scrollTo(0, top - 150);
            }
            else {
                // IE 11 - Edge browsers
                firstScrollableParent.scrollTop = top - 150;
            }
        }
        else {
            this.DOMService.getNativeWindow().scrollTo(0, top - 150);
        }
    }
    scrollToTheTop(elementRef) {
        const firstScrollableParent = this.getFirstScrollableParent(elementRef.nativeElement);
        if (firstScrollableParent !== this.DOMService.getNativeDocument().body) {
            if (firstScrollableParent.scrollTo) {
                firstScrollableParent.scrollTo(0, 0);
            }
            else {
                // IE 11 - Edge browsers
                firstScrollableParent.scrollTop = 0;
            }
        }
        else {
            this.DOMService.getNativeWindow().scrollTo(0, 0);
        }
    }
    scrollToTheBottom(elementRef) {
        const firstScrollableParent = this.getFirstScrollableParent(elementRef.nativeElement);
        if (firstScrollableParent !== this.DOMService.getNativeDocument().body) {
            if (firstScrollableParent.scrollTo) {
                firstScrollableParent.scrollTo(0, this.DOMService.getNativeDocument().body.scrollHeight);
            }
            else {
                // IE 11 - Edge browsers
                firstScrollableParent.scrollTop =
                    firstScrollableParent.scrollHeight -
                        firstScrollableParent.clientHeight;
            }
        }
        else {
            this.DOMService.getNativeWindow().scrollTo(0, this.DOMService.getNativeDocument().body.scrollHeight);
        }
    }
    getFirstScrollableParent(node) {
        const regex = /(auto|scroll|overlay)/;
        const style = (node, prop) => this.DOMService.getNativeWindow()
            .getComputedStyle(node, null)
            .getPropertyValue(prop);
        const scroll = (node) => regex.test(style(node, 'overflow') +
            style(node, 'overflow-y') +
            style(node, 'overflow-x'));
        const scrollparent = (node) => {
            return !node || node === this.DOMService.getNativeDocument().body
                ? this.DOMService.getNativeDocument().body
                : scroll(node)
                    ? node
                    : scrollparent(node.parentNode);
        };
        return scrollparent(node);
    }
    calculateDocumentHeight() {
        const documentRef = this.DOMService.getNativeDocument();
        return Math.max(documentRef.body.scrollHeight, documentRef.documentElement.scrollHeight, documentRef.body.offsetHeight, documentRef.documentElement.offsetHeight, documentRef.body.clientHeight, documentRef.documentElement.clientHeight);
    }
    getScrollOffsets() {
        const winReference = this.DOMService.getNativeWindow();
        const docReference = this.DOMService.getNativeDocument();
        // This works for all browsers except IE versions 8 and before
        if (winReference.pageXOffset != null)
            return { x: winReference.pageXOffset, y: winReference.pageYOffset };
        // For IE (or any browser) in Standards mode
        if (docReference.compatMode == 'CSS1Compat')
            return {
                x: docReference.documentElement.scrollLeft,
                y: docReference.documentElement.scrollTop
            };
        // For browsers in Quirks mode
        return {
            x: docReference.body.scrollLeft,
            y: docReference.body.scrollTop
        };
    }
    elementsFromPoint(x, y) {
        var parents = [];
        var parent = void 0;
        do {
            const elem = this.DOMService.getNativeDocument().elementFromPoint(x, y);
            if (elem && parent !== elem) {
                parent = elem;
                parents.push(parent);
                parent.style.pointerEvents = 'none';
            }
            else {
                parent = false;
            }
        } while (parent);
        parents.forEach(function (parent) {
            return (parent.style.pointerEvents = 'all');
        });
        return parents;
    }
    getFirstElementWithoutKeyword(elements, keyword) {
        while (elements[0] &&
            elements[0].classList.toString().includes(keyword)) {
            elements.shift();
        }
        return elements[0];
    }
}
DocumentService.decorators = [
    { type: Injectable }
];
DocumentService.ctorParameters = () => [
    { type: DomRefService },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1qb3lyaWRlL3NyYy9saWIvc2VydmljZXMvZG9jdW1lbnQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFjLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQXlCcEQsTUFBTSxPQUFPLGVBQWU7SUFHeEIsWUFBNkIsVUFBeUIsRUFBdUIsVUFBa0I7UUFBbEUsZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUNsRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7WUFDL0Isd0JBQXdCO1lBQ3hCLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztJQUVELGtCQUFrQixDQUFDLFVBQXNCO1FBQ3JDLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNoRSxDQUFDO0lBRUQsbUJBQW1CLENBQUMsVUFBc0I7UUFDdEMsT0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ2pFLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxVQUFzQjtRQUN4QyxNQUFN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LENBQUMsRUFDcEQ7WUFDRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDcEI7UUFDRCxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDOzs7WUExUEosVUFBVTs7O1lBekJGLGFBQWE7WUE2QnVFLE1BQU0sdUJBQXRDLE1BQU0sU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEb21SZWZTZXJ2aWNlIH0gZnJvbSAnLi9kb20uc2VydmljZSc7XHJcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRG9jdW1lbnRTZXJ2aWNlIHtcclxuICAgIGdldEVsZW1lbnRGaXhlZFRvcChlbGVtZW50UmVmOiBFbGVtZW50UmVmKTogbnVtYmVyO1xyXG5cclxuICAgIGdldEVsZW1lbnRGaXhlZExlZnQoZWxlbWVudFJlZjogRWxlbWVudFJlZik7XHJcblxyXG4gICAgZ2V0RWxlbWVudEFic29sdXRlVG9wKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpO1xyXG5cclxuICAgIGdldEVsZW1lbnRBYnNvbHV0ZUxlZnQoZWxlbWVudFJlZjogRWxlbWVudFJlZik7XHJcblxyXG4gICAgc2V0RG9jdW1lbnRIZWlnaHQoKTtcclxuXHJcbiAgICBnZXREb2N1bWVudEhlaWdodCgpOiBudW1iZXI7XHJcbiAgICBpc1BhcmVudFNjcm9sbGFibGUoZWxlbWVudFJlZjogRWxlbWVudFJlZik6IGJvb2xlYW47XHJcbiAgICBpc0VsZW1lbnRCZXlvbmRPdGhlcnMoXHJcbiAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBpc0VsZW1lbnRGaXhlZDogYm9vbGVhbixcclxuICAgICAgICBrZXl3b3JkVG9EaXNjYXJkOiBzdHJpbmdcclxuICAgICk6IG51bWJlcjtcclxuICAgIHNjcm9sbFRvVGhlVG9wKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpOiB2b2lkO1xyXG4gICAgc2Nyb2xsVG9UaGVCb3R0b20oZWxlbWVudFJlZjogRWxlbWVudFJlZik6IHZvaWQ7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIERvY3VtZW50U2VydmljZSBpbXBsZW1lbnRzIElEb2N1bWVudFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBkb2N1bWVudEhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgRE9NU2VydmljZTogRG9tUmVmU2VydmljZSwgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKCFpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0RG9jdW1lbnRIZWlnaHQoKTtcclxuICAgICAgICB2YXIgZG9jID0gRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpO1xyXG4gICAgICAgIGlmIChkb2MgJiYgIWRvYy5lbGVtZW50c0Zyb21Qb2ludCkge1xyXG4gICAgICAgICAgICAvLyBJRSAxMSAtIEVkZ2UgYnJvd3NlcnNcclxuICAgICAgICAgICAgZG9jLmVsZW1lbnRzRnJvbVBvaW50ID0gdGhpcy5lbGVtZW50c0Zyb21Qb2ludC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50Rml4ZWRUb3AoZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnRGaXhlZExlZnQoZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50QWJzb2x1dGVUb3AoZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbE9mZnNldHMgPSB0aGlzLmdldFNjcm9sbE9mZnNldHMoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICtcclxuICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0cy55XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50QWJzb2x1dGVMZWZ0KGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcclxuICAgICAgICBjb25zdCBzY3JvbGxPZmZzZXRzID0gdGhpcy5nZXRTY3JvbGxPZmZzZXRzKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgK1xyXG4gICAgICAgICAgICBzY3JvbGxPZmZzZXRzLnhcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERvY3VtZW50SGVpZ2h0KCkge1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnRIZWlnaHQgPSB0aGlzLmNhbGN1bGF0ZURvY3VtZW50SGVpZ2h0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RG9jdW1lbnRIZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNQYXJlbnRTY3JvbGxhYmxlKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLmdldEZpcnN0U2Nyb2xsYWJsZVBhcmVudChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpICE9PVxyXG4gICAgICAgICAgICB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5ib2R5XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc0VsZW1lbnRCZXlvbmRPdGhlcnMoXHJcbiAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBpc0VsZW1lbnRGaXhlZDogYm9vbGVhbixcclxuICAgICAgICBrZXl3b3JkVG9EaXNjYXJkOiBzdHJpbmdcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IHgxID0gaXNFbGVtZW50Rml4ZWRcclxuICAgICAgICAgICAgPyB0aGlzLmdldEVsZW1lbnRGaXhlZExlZnQoZWxlbWVudFJlZilcclxuICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnRBYnNvbHV0ZUxlZnQoZWxlbWVudFJlZik7XHJcbiAgICAgICAgY29uc3QgeTEgPSBpc0VsZW1lbnRGaXhlZFxyXG4gICAgICAgICAgICA/IHRoaXMuZ2V0RWxlbWVudEZpeGVkVG9wKGVsZW1lbnRSZWYpXHJcbiAgICAgICAgICAgIDogdGhpcy5nZXRFbGVtZW50QWJzb2x1dGVUb3AoZWxlbWVudFJlZik7XHJcbiAgICAgICAgY29uc3QgeDIgPVxyXG4gICAgICAgICAgICB4MSArIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIDE7XHJcbiAgICAgICAgY29uc3QgeTIgPVxyXG4gICAgICAgICAgICB5MSArIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLSAxO1xyXG5cclxuICAgICAgICBjb25zdCBlbGVtZW50czEgPSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5lbGVtZW50c0Zyb21Qb2ludChcclxuICAgICAgICAgICAgeDEsXHJcbiAgICAgICAgICAgIHkxXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBlbGVtZW50czIgPSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5lbGVtZW50c0Zyb21Qb2ludChcclxuICAgICAgICAgICAgeDIsXHJcbiAgICAgICAgICAgIHkyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnRzMS5sZW5ndGggPT09IDAgJiYgZWxlbWVudHMyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDE7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmdldEZpcnN0RWxlbWVudFdpdGhvdXRLZXl3b3JkKGVsZW1lbnRzMSwga2V5d29yZFRvRGlzY2FyZCkgIT09XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgfHxcclxuICAgICAgICAgICAgdGhpcy5nZXRGaXJzdEVsZW1lbnRXaXRob3V0S2V5d29yZChlbGVtZW50czIsIGtleXdvcmRUb0Rpc2NhcmQpICE9PVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1cclxuXHJcbiAgICBzY3JvbGxJbnRvVmlldyhlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBpc0VsZW1lbnRGaXhlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0U2Nyb2xsYWJsZVBhcmVudCA9IHRoaXMuZ2V0Rmlyc3RTY3JvbGxhYmxlUGFyZW50KFxyXG4gICAgICAgICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHRvcCA9IGlzRWxlbWVudEZpeGVkXHJcbiAgICAgICAgICAgID8gdGhpcy5nZXRFbGVtZW50Rml4ZWRUb3AoZWxlbWVudFJlZilcclxuICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnRBYnNvbHV0ZVRvcChlbGVtZW50UmVmKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGZpcnN0U2Nyb2xsYWJsZVBhcmVudCAhPT0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuYm9keVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBpZiAoZmlyc3RTY3JvbGxhYmxlUGFyZW50LnNjcm9sbFRvKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG8oMCwgdG9wIC0gMTUwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIElFIDExIC0gRWRnZSBicm93c2Vyc1xyXG4gICAgICAgICAgICAgICAgZmlyc3RTY3JvbGxhYmxlUGFyZW50LnNjcm9sbFRvcCA9IHRvcCAtIDE1MDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVXaW5kb3coKS5zY3JvbGxUbygwLCB0b3AgLSAxNTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzY3JvbGxUb1RoZVRvcChlbGVtZW50UmVmOiBFbGVtZW50UmVmKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZmlyc3RTY3JvbGxhYmxlUGFyZW50ID0gdGhpcy5nZXRGaXJzdFNjcm9sbGFibGVQYXJlbnQoXHJcbiAgICAgICAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQgIT09IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmJvZHlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgaWYgKGZpcnN0U2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUbykge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RTY3JvbGxhYmxlUGFyZW50LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gSUUgMTEgLSBFZGdlIGJyb3dzZXJzXHJcbiAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG9wID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVXaW5kb3coKS5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2Nyb2xsVG9UaGVCb3R0b20oZWxlbWVudFJlZjogRWxlbWVudFJlZik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0U2Nyb2xsYWJsZVBhcmVudCA9IHRoaXMuZ2V0Rmlyc3RTY3JvbGxhYmxlUGFyZW50KFxyXG4gICAgICAgICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgZmlyc3RTY3JvbGxhYmxlUGFyZW50ICE9PSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5ib2R5XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG8pIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0U2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUbyhcclxuICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmJvZHkuc2Nyb2xsSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gSUUgMTEgLSBFZGdlIGJyb3dzZXJzXHJcbiAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG9wID1cclxuICAgICAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsSGVpZ2h0IC1cclxuICAgICAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZVdpbmRvdygpLnNjcm9sbFRvKFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmJvZHkuc2Nyb2xsSGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Rmlyc3RTY3JvbGxhYmxlUGFyZW50KG5vZGU6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gLyhhdXRvfHNjcm9sbHxvdmVybGF5KS87XHJcblxyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gKG5vZGU6IGFueSwgcHJvcDogYW55KSA9PlxyXG4gICAgICAgICAgICB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlV2luZG93KClcclxuICAgICAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpXHJcbiAgICAgICAgICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsID0gKG5vZGU6IGFueSkgPT5cclxuICAgICAgICAgICAgcmVnZXgudGVzdChcclxuICAgICAgICAgICAgICAgIHN0eWxlKG5vZGUsICdvdmVyZmxvdycpICtcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZShub2RlLCAnb3ZlcmZsb3cteScpICtcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZShub2RlLCAnb3ZlcmZsb3cteCcpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNjcm9sbHBhcmVudCA9IChub2RlOiBhbnkpOiBhbnkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIW5vZGUgfHwgbm9kZSA9PT0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuYm9keVxyXG4gICAgICAgICAgICAgICAgPyB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5ib2R5XHJcbiAgICAgICAgICAgICAgICA6IHNjcm9sbChub2RlKVxyXG4gICAgICAgICAgICAgICAgPyBub2RlXHJcbiAgICAgICAgICAgICAgICA6IHNjcm9sbHBhcmVudChub2RlLnBhcmVudE5vZGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JvbGxwYXJlbnQobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVEb2N1bWVudEhlaWdodCgpIHtcclxuICAgICAgICBjb25zdCBkb2N1bWVudFJlZiA9IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpO1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heChcclxuICAgICAgICAgICAgZG9jdW1lbnRSZWYuYm9keS5zY3JvbGxIZWlnaHQsXHJcbiAgICAgICAgICAgIGRvY3VtZW50UmVmLmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsXHJcbiAgICAgICAgICAgIGRvY3VtZW50UmVmLmJvZHkub2Zmc2V0SGVpZ2h0LFxyXG4gICAgICAgICAgICBkb2N1bWVudFJlZi5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxyXG4gICAgICAgICAgICBkb2N1bWVudFJlZi5ib2R5LmNsaWVudEhlaWdodCxcclxuICAgICAgICAgICAgZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTY3JvbGxPZmZzZXRzKCkge1xyXG4gICAgICAgIGNvbnN0IHdpblJlZmVyZW5jZSA9IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVXaW5kb3coKTtcclxuICAgICAgICBjb25zdCBkb2NSZWZlcmVuY2UgPSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKTtcclxuXHJcbiAgICAgICAgLy8gVGhpcyB3b3JrcyBmb3IgYWxsIGJyb3dzZXJzIGV4Y2VwdCBJRSB2ZXJzaW9ucyA4IGFuZCBiZWZvcmVcclxuICAgICAgICBpZiAod2luUmVmZXJlbmNlLnBhZ2VYT2Zmc2V0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IHg6IHdpblJlZmVyZW5jZS5wYWdlWE9mZnNldCwgeTogd2luUmVmZXJlbmNlLnBhZ2VZT2Zmc2V0IH07XHJcblxyXG4gICAgICAgIC8vIEZvciBJRSAob3IgYW55IGJyb3dzZXIpIGluIFN0YW5kYXJkcyBtb2RlXHJcbiAgICAgICAgaWYgKGRvY1JlZmVyZW5jZS5jb21wYXRNb2RlID09ICdDU1MxQ29tcGF0JylcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IGRvY1JlZmVyZW5jZS5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcclxuICAgICAgICAgICAgICAgIHk6IGRvY1JlZmVyZW5jZS5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEZvciBicm93c2VycyBpbiBRdWlya3MgbW9kZVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IGRvY1JlZmVyZW5jZS5ib2R5LnNjcm9sbExlZnQsXHJcbiAgICAgICAgICAgIHk6IGRvY1JlZmVyZW5jZS5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbGVtZW50c0Zyb21Qb2ludCh4LCB5KSB7XHJcbiAgICAgICAgdmFyIHBhcmVudHMgPSBbXTtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdm9pZCAwO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmVsZW1lbnRGcm9tUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICAgICAgeVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoZWxlbSAmJiBwYXJlbnQgIT09IGVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudCA9IGVsZW07XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IHdoaWxlIChwYXJlbnQpO1xyXG4gICAgICAgIHBhcmVudHMuZm9yRWFjaChmdW5jdGlvbihwYXJlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChwYXJlbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhbGwnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcGFyZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZpcnN0RWxlbWVudFdpdGhvdXRLZXl3b3JkKFxyXG4gICAgICAgIGVsZW1lbnRzOiBFbGVtZW50W10sXHJcbiAgICAgICAga2V5d29yZDogc3RyaW5nXHJcbiAgICApOiBFbGVtZW50IHtcclxuICAgICAgICB3aGlsZSAoXHJcbiAgICAgICAgICAgIGVsZW1lbnRzWzBdICYmXHJcbiAgICAgICAgICAgIGVsZW1lbnRzWzBdLmNsYXNzTGlzdC50b1N0cmluZygpLmluY2x1ZGVzKGtleXdvcmQpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50c1swXTtcclxuICAgIH1cclxufVxyXG4iXX0=