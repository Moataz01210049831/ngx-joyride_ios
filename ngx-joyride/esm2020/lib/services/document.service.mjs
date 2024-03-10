import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";
import * as i0 from "@angular/core";
import * as i1 from "./dom.service";
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
        return elementRef.nativeElement.getBoundingClientRect().top;
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
            ? this.getElementFixedTop(elementRef)
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
            ? this.getElementFixedTop(elementRef)
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
DocumentService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: DocumentService, deps: [{ token: i1.DomRefService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
DocumentService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: DocumentService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: DocumentService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DomRefService }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1qb3lyaWRlL3NyYy9saWIvc2VydmljZXMvZG9jdW1lbnQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFjLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQXlCcEQsTUFBTSxPQUFPLGVBQWU7SUFHeEIsWUFBNkIsVUFBeUIsRUFBdUIsVUFBa0I7UUFBbEUsZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUNsRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7WUFDL0Isd0JBQXdCO1lBQ3hCLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztJQUVELGtCQUFrQixDQUFDLFVBQXNCO1FBQ3JDLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNoRSxDQUFDO0lBRUQsbUJBQW1CLENBQUMsVUFBc0I7UUFDdEMsT0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ2pFLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxVQUFzQjtRQUN4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztR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QUM7U0FDcEI7UUFDRCxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDOzs0R0F6UFEsZUFBZSwrQ0FHd0MsV0FBVztnSEFIbEUsZUFBZTsyRkFBZixlQUFlO2tCQUQzQixVQUFVO3NGQUlrRixNQUFNOzBCQUF0QyxNQUFNOzJCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFbGVtZW50UmVmLCBJbmplY3QsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21SZWZTZXJ2aWNlIH0gZnJvbSAnLi9kb20uc2VydmljZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJRG9jdW1lbnRTZXJ2aWNlIHtcbiAgICBnZXRFbGVtZW50Rml4ZWRUb3AoZWxlbWVudFJlZjogRWxlbWVudFJlZik6IG51bWJlcjtcblxuICAgIGdldEVsZW1lbnRGaXhlZExlZnQoZWxlbWVudFJlZjogRWxlbWVudFJlZik7XG5cbiAgICBnZXRFbGVtZW50QWJzb2x1dGVUb3AoZWxlbWVudFJlZjogRWxlbWVudFJlZik7XG5cbiAgICBnZXRFbGVtZW50QWJzb2x1dGVMZWZ0KGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpO1xuXG4gICAgc2V0RG9jdW1lbnRIZWlnaHQoKTtcblxuICAgIGdldERvY3VtZW50SGVpZ2h0KCk6IG51bWJlcjtcbiAgICBpc1BhcmVudFNjcm9sbGFibGUoZWxlbWVudFJlZjogRWxlbWVudFJlZik6IGJvb2xlYW47XG4gICAgaXNFbGVtZW50QmV5b25kT3RoZXJzKFxuICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBpc0VsZW1lbnRGaXhlZDogYm9vbGVhbixcbiAgICAgICAga2V5d29yZFRvRGlzY2FyZDogc3RyaW5nXG4gICAgKTogbnVtYmVyO1xuICAgIHNjcm9sbFRvVGhlVG9wKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpOiB2b2lkO1xuICAgIHNjcm9sbFRvVGhlQm90dG9tKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRTZXJ2aWNlIGltcGxlbWVudHMgSURvY3VtZW50U2VydmljZSB7XG4gICAgcHJpdmF0ZSBkb2N1bWVudEhlaWdodDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBET01TZXJ2aWNlOiBEb21SZWZTZXJ2aWNlLCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3QpIHtcbiAgICAgICAgaWYgKCFpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0RG9jdW1lbnRIZWlnaHQoKTtcbiAgICAgICAgdmFyIGRvYyA9IERPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKTtcbiAgICAgICAgaWYgKGRvYyAmJiAhZG9jLmVsZW1lbnRzRnJvbVBvaW50KSB7XG4gICAgICAgICAgICAvLyBJRSAxMSAtIEVkZ2UgYnJvd3NlcnNcbiAgICAgICAgICAgIGRvYy5lbGVtZW50c0Zyb21Qb2ludCA9IHRoaXMuZWxlbWVudHNGcm9tUG9pbnQuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEVsZW1lbnRGaXhlZFRvcChlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIH1cblxuICAgIGdldEVsZW1lbnRGaXhlZExlZnQoZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgICAgICByZXR1cm4gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudEFic29sdXRlVG9wKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsT2Zmc2V0cyA9IHRoaXMuZ2V0U2Nyb2xsT2Zmc2V0cygpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArXG4gICAgICAgICAgICBzY3JvbGxPZmZzZXRzLnlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRFbGVtZW50QWJzb2x1dGVMZWZ0KGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsT2Zmc2V0cyA9IHRoaXMuZ2V0U2Nyb2xsT2Zmc2V0cygpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgK1xuICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0cy54XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2V0RG9jdW1lbnRIZWlnaHQoKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnRIZWlnaHQgPSB0aGlzLmNhbGN1bGF0ZURvY3VtZW50SGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgZ2V0RG9jdW1lbnRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIGlzUGFyZW50U2Nyb2xsYWJsZShlbGVtZW50UmVmOiBFbGVtZW50UmVmKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmdldEZpcnN0U2Nyb2xsYWJsZVBhcmVudChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpICE9PVxuICAgICAgICAgICAgdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuYm9keVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlzRWxlbWVudEJleW9uZE90aGVycyhcbiAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgaXNFbGVtZW50Rml4ZWQ6IGJvb2xlYW4sXG4gICAgICAgIGtleXdvcmRUb0Rpc2NhcmQ6IHN0cmluZ1xuICAgICkge1xuICAgICAgICBjb25zdCB4MSA9IGlzRWxlbWVudEZpeGVkXG4gICAgICAgICAgICA/IHRoaXMuZ2V0RWxlbWVudEZpeGVkTGVmdChlbGVtZW50UmVmKVxuICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnRBYnNvbHV0ZUxlZnQoZWxlbWVudFJlZik7XG4gICAgICAgIGNvbnN0IHkxID0gaXNFbGVtZW50Rml4ZWRcbiAgICAgICAgICAgID8gdGhpcy5nZXRFbGVtZW50Rml4ZWRUb3AoZWxlbWVudFJlZilcbiAgICAgICAgICAgIDogdGhpcy5nZXRFbGVtZW50QWJzb2x1dGVUb3AoZWxlbWVudFJlZik7XG4gICAgICAgIGNvbnN0IHgyID1cbiAgICAgICAgICAgIHgxICsgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gMTtcbiAgICAgICAgY29uc3QgeTIgPVxuICAgICAgICAgICAgeTEgKyBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC0gMTtcblxuICAgICAgICBjb25zdCBlbGVtZW50czEgPSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5lbGVtZW50c0Zyb21Qb2ludChcbiAgICAgICAgICAgIHgxLFxuICAgICAgICAgICAgeTFcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZWxlbWVudHMyID0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuZWxlbWVudHNGcm9tUG9pbnQoXG4gICAgICAgICAgICB4MixcbiAgICAgICAgICAgIHkyXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnRzMS5sZW5ndGggPT09IDAgJiYgZWxlbWVudHMyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuZ2V0Rmlyc3RFbGVtZW50V2l0aG91dEtleXdvcmQoZWxlbWVudHMxLCBrZXl3b3JkVG9EaXNjYXJkKSAhPT1cbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgfHxcbiAgICAgICAgICAgIHRoaXMuZ2V0Rmlyc3RFbGVtZW50V2l0aG91dEtleXdvcmQoZWxlbWVudHMyLCBrZXl3b3JkVG9EaXNjYXJkKSAhPT1cbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMztcbiAgICB9XG5cbiAgICBzY3JvbGxJbnRvVmlldyhlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBpc0VsZW1lbnRGaXhlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBmaXJzdFNjcm9sbGFibGVQYXJlbnQgPSB0aGlzLmdldEZpcnN0U2Nyb2xsYWJsZVBhcmVudChcbiAgICAgICAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICApO1xuICAgICAgICBjb25zdCB0b3AgPSBpc0VsZW1lbnRGaXhlZFxuICAgICAgICAgICAgPyB0aGlzLmdldEVsZW1lbnRGaXhlZFRvcChlbGVtZW50UmVmKVxuICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnRBYnNvbHV0ZVRvcChlbGVtZW50UmVmKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZmlyc3RTY3JvbGxhYmxlUGFyZW50ICE9PSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5ib2R5XG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGZpcnN0U2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUbykge1xuICAgICAgICAgICAgICAgIGZpcnN0U2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUbygwLCB0b3AgLSAxNTApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJRSAxMSAtIEVkZ2UgYnJvd3NlcnNcbiAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG9wID0gdG9wIC0gMTUwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZVdpbmRvdygpLnNjcm9sbFRvKDAsIHRvcCAtIDE1MCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzY3JvbGxUb1RoZVRvcChlbGVtZW50UmVmOiBFbGVtZW50UmVmKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpcnN0U2Nyb2xsYWJsZVBhcmVudCA9IHRoaXMuZ2V0Rmlyc3RTY3JvbGxhYmxlUGFyZW50KFxuICAgICAgICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGZpcnN0U2Nyb2xsYWJsZVBhcmVudCAhPT0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuYm9keVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG8pIHtcbiAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElFIDExIC0gRWRnZSBicm93c2Vyc1xuICAgICAgICAgICAgICAgIGZpcnN0U2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZVdpbmRvdygpLnNjcm9sbFRvKDAsIDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9UaGVCb3R0b20oZWxlbWVudFJlZjogRWxlbWVudFJlZik6IHZvaWQge1xuICAgICAgICBjb25zdCBmaXJzdFNjcm9sbGFibGVQYXJlbnQgPSB0aGlzLmdldEZpcnN0U2Nyb2xsYWJsZVBhcmVudChcbiAgICAgICAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICApO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQgIT09IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmJvZHlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3RTY3JvbGxhYmxlUGFyZW50LnNjcm9sbFRvKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RTY3JvbGxhYmxlUGFyZW50LnNjcm9sbFRvKFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKS5ib2R5LnNjcm9sbEhlaWdodFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElFIDExIC0gRWRnZSBicm93c2Vyc1xuICAgICAgICAgICAgICAgIGZpcnN0U2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUb3AgPVxuICAgICAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsSGVpZ2h0IC1cbiAgICAgICAgICAgICAgICAgICAgZmlyc3RTY3JvbGxhYmxlUGFyZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVXaW5kb3coKS5zY3JvbGxUbyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmJvZHkuc2Nyb2xsSGVpZ2h0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGaXJzdFNjcm9sbGFibGVQYXJlbnQobm9kZTogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gLyhhdXRvfHNjcm9sbHxvdmVybGF5KS87XG5cbiAgICAgICAgY29uc3Qgc3R5bGUgPSAobm9kZTogYW55LCBwcm9wOiBhbnkpID0+XG4gICAgICAgICAgICB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlV2luZG93KClcbiAgICAgICAgICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKVxuICAgICAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuXG4gICAgICAgIGNvbnN0IHNjcm9sbCA9IChub2RlOiBhbnkpID0+XG4gICAgICAgICAgICByZWdleC50ZXN0KFxuICAgICAgICAgICAgICAgIHN0eWxlKG5vZGUsICdvdmVyZmxvdycpICtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUobm9kZSwgJ292ZXJmbG93LXknKSArXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKG5vZGUsICdvdmVyZmxvdy14JylcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xscGFyZW50ID0gKG5vZGU6IGFueSk6IGFueSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIW5vZGUgfHwgbm9kZSA9PT0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuYm9keVxuICAgICAgICAgICAgICAgID8gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCkuYm9keVxuICAgICAgICAgICAgICAgIDogc2Nyb2xsKG5vZGUpXG4gICAgICAgICAgICAgICAgPyBub2RlXG4gICAgICAgICAgICAgICAgOiBzY3JvbGxwYXJlbnQobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xscGFyZW50KG5vZGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlRG9jdW1lbnRIZWlnaHQoKSB7XG4gICAgICAgIGNvbnN0IGRvY3VtZW50UmVmID0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZURvY3VtZW50KCk7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChcbiAgICAgICAgICAgIGRvY3VtZW50UmVmLmJvZHkuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICAgICAgZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCxcbiAgICAgICAgICAgIGRvY3VtZW50UmVmLmJvZHkub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgIGRvY3VtZW50UmVmLmJvZHkuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2Nyb2xsT2Zmc2V0cygpIHtcbiAgICAgICAgY29uc3Qgd2luUmVmZXJlbmNlID0gdGhpcy5ET01TZXJ2aWNlLmdldE5hdGl2ZVdpbmRvdygpO1xuICAgICAgICBjb25zdCBkb2NSZWZlcmVuY2UgPSB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlRG9jdW1lbnQoKTtcblxuICAgICAgICAvLyBUaGlzIHdvcmtzIGZvciBhbGwgYnJvd3NlcnMgZXhjZXB0IElFIHZlcnNpb25zIDggYW5kIGJlZm9yZVxuICAgICAgICBpZiAod2luUmVmZXJlbmNlLnBhZ2VYT2Zmc2V0ICE9IG51bGwpXG4gICAgICAgICAgICByZXR1cm4geyB4OiB3aW5SZWZlcmVuY2UucGFnZVhPZmZzZXQsIHk6IHdpblJlZmVyZW5jZS5wYWdlWU9mZnNldCB9O1xuXG4gICAgICAgIC8vIEZvciBJRSAob3IgYW55IGJyb3dzZXIpIGluIFN0YW5kYXJkcyBtb2RlXG4gICAgICAgIGlmIChkb2NSZWZlcmVuY2UuY29tcGF0TW9kZSA9PSAnQ1NTMUNvbXBhdCcpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IGRvY1JlZmVyZW5jZS5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgICAgICAgICB5OiBkb2NSZWZlcmVuY2UuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAvLyBGb3IgYnJvd3NlcnMgaW4gUXVpcmtzIG1vZGVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGRvY1JlZmVyZW5jZS5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgICB5OiBkb2NSZWZlcmVuY2UuYm9keS5zY3JvbGxUb3BcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVsZW1lbnRzRnJvbVBvaW50KHgsIHkpIHtcbiAgICAgICAgdmFyIHBhcmVudHMgPSBbXTtcbiAgICAgICAgdmFyIHBhcmVudCA9IHZvaWQgMDtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVEb2N1bWVudCgpLmVsZW1lbnRGcm9tUG9pbnQoXG4gICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICB5XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGVsZW0gJiYgcGFyZW50ICE9PSBlbGVtKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gZWxlbTtcbiAgICAgICAgICAgICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKHBhcmVudCk7XG4gICAgICAgIHBhcmVudHMuZm9yRWFjaChmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAocGFyZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYWxsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGFyZW50cztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZpcnN0RWxlbWVudFdpdGhvdXRLZXl3b3JkKFxuICAgICAgICBlbGVtZW50czogRWxlbWVudFtdLFxuICAgICAgICBrZXl3b3JkOiBzdHJpbmdcbiAgICApOiBFbGVtZW50IHtcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgZWxlbWVudHNbMF0gJiZcbiAgICAgICAgICAgIGVsZW1lbnRzWzBdLmNsYXNzTGlzdC50b1N0cmluZygpLmluY2x1ZGVzKGtleXdvcmQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgZWxlbWVudHMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHNbMF07XG4gICAgfVxufVxuIl19