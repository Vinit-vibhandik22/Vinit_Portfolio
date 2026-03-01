import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appNeonLetters]',
    standalone: true
})
export class NeonLettersDirective implements AfterViewInit {
    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.wrapLetters(this.el.nativeElement);
        }, 0);
    }

    wrapLetters(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            if (!text || !text.trim()) return;

            const spanWrapper = document.createElement('span');
            for (const char of text) {
                if (char.trim() === '') {
                    spanWrapper.appendChild(document.createTextNode(char));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'neon-letter';
                    span.style.animationDelay = `${Math.random() * 5}s`;
                    span.style.animationDuration = `${1.5 + Math.random() * 3}s`;
                    spanWrapper.appendChild(span);
                }
            }
            node.parentNode?.replaceChild(spanWrapper, node);
        } else {
            const tagsToSkip = ['SCRIPT', 'STYLE', 'SPAN'];
            if (node instanceof HTMLElement && tagsToSkip.includes(node.tagName)) {
                return;
            }
            const children = Array.from(node.childNodes);
            for (const child of children) {
                this.wrapLetters(child);
            }
        }
    }
}
