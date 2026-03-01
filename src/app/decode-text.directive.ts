import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appDecodeText]',
    standalone: true
})
export class DecodeTextDirective implements OnInit {
    @Input('appDecodeText') fullText = '';
    private originalContent = '';
    private chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.originalContent = this.fullText || this.el.nativeElement.textContent?.trim() || '';
        this.el.nativeElement.textContent = '';

        // Start effect shortly after sequence finish
        setTimeout(() => {
            this.startDecryptEffect();
        }, 1200);
    }

    startDecryptEffect() {
        let iteration = 0;
        const interval = setInterval(() => {
            this.el.nativeElement.textContent = this.originalContent
                .split('')
                .map((char, i) => {
                    if (i < iteration) {
                        return char;
                    }
                    if (char === ' ') return ' ';
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');

            // Adjust speed of uncovering characters
            if (iteration >= this.originalContent.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);
    }
}
