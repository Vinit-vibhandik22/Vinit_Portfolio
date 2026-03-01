import { Component, OnDestroy, OnInit } from '@angular/core';
import { initializeMatrixEffect } from './matrix/matrix-effect';
import { NgOptimizedImage } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';
import { NeonLettersDirective } from './neon-letters.directive';
import { DecodeTextDirective } from './decode-text.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TerminalComponent,
    NeonLettersDirective,
    DecodeTextDirective
  ],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  showOpeningSequence = true;
  openingText = '';
  fullOpeningText = "Welcome User, All Systems Online";
  showIpLine = false;
  ipText = '';
  fullIpText = '';

  roles = ['a backend developer', 'a frontend developer', 'practicing competitive coding', 'learning Cloud and DevOps'];
  index = 0;
  currentText = '';
  isDeleting = false;
  typingSpeed = 150;
  pauseDuration = 2000;
  isTerminalOpen = false;
  isTerminalClosing = false;

  ngOnInit(): void {
    initializeMatrixEffect();
    this.startOpeningSequence();
  }

  startOpeningSequence() {
    if (this.openingText.length < this.fullOpeningText.length) {
      this.openingText += this.fullOpeningText.charAt(this.openingText.length);
      setTimeout(() => this.startOpeningSequence(), 100);
    } else {
      setTimeout(() => {
        this.startIpSequence();
      }, 500);
    }
  }

  generateRandomIp(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  startIpSequence() {
    this.showIpLine = true;
    this.fullIpText = `Establishing dynamic IP: ${this.generateRandomIp()}`;
    this.typeIpText();
  }

  typeIpText() {
    if (this.ipText.length < this.fullIpText.length) {
      this.ipText += this.fullIpText.charAt(this.ipText.length);
      setTimeout(() => this.typeIpText(), 100);
    } else {
      setTimeout(() => {
        this.showOpeningSequence = false;
        this.startTypingEffect();
      }, 1000);
    }
  }

  ngOnDestroy() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.remove();
    }
  }

  toggleTerminal() {
    this.isTerminalOpen = !this.isTerminalOpen;
  }

  handleTerminalClosed() {
    this.isTerminalClosing = true;
    setTimeout(() => {
      this.isTerminalOpen = false;
      this.isTerminalClosing = false;
    }, 400); // Wait for the CRT shut off animation
  }

  startTypingEffect() {
    const fullText = this.roles[this.index];
    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    let speed = this.typingSpeed;
    if (this.isDeleting) speed /= 2;

    if (!this.isDeleting && this.currentText === fullText) {
      speed = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.index = (this.index + 1) % this.roles.length;
    }

    setTimeout(() => this.startTypingEffect(), speed);
  }
}
