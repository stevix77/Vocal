import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Generated class for the BtnRecordHighlightDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[btn-record-highlight]' // Attribute selector
})
export class BtnRecordHighlightDirective {

  constructor(private el: ElementRef) {
    console.log('Hello BtnRecordHighlightDirective Directive');
  }

  @HostListener('touchstart') onTouchStart() {
    this.highlight('red');
  }

  @HostListener('touchend') onTouchEnd() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
