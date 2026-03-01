import { Component, OnDestroy, OnInit } from '@angular/core';
import { initializeMatrixEffect } from './matrix/matrix-effect';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalComponent } from './terminal/terminal.component';
import { NeonLettersDirective } from './neon-letters.directive';
import { DecodeTextDirective } from './decode-text.directive';
import { playTypingClick, toggleAmbientDrone, isAmbientPlaying } from './audio/audio-effects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TerminalComponent,
    NeonLettersDirective,
    DecodeTextDirective,
    FormsModule
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
  audioEnabled = false;

  roles = ['a backend developer', 'a frontend developer', 'practicing competitive coding', 'learning Cloud and DevOps'];
  index = 0;
  currentText = '';
  isDeleting = false;
  typingSpeed = 150;
  pauseDuration = 2000;
  isTerminalOpen = false;
  isTerminalClosing = false;

  // Contact form
  showContactForm = false;
  contactName = '';
  contactPhone = '';
  contactMessage = '';
  contactSending = false;
  contactSent = false;

  // Skills for progress bars
  skills = [
    { name: 'Python', level: 80 },
    { name: 'C++', level: 70 },
    { name: 'Oracle Cloud (OCI)', level: 75 },
    { name: 'Docker & DevOps', level: 60 },
    { name: 'Angular / TypeScript', level: 65 },
    { name: 'Machine Learning / AI', level: 55 },
    { name: 'Data Analysis', level: 65 },
    { name: 'Git & Version Control', level: 80 },
  ];
  skillsVisible = false;

  // System status
  cpuUsage = 0;
  ramUsage = 0;
  networkPing = 0;
  threatLevel = 'LOW';
  private statusInterval: any;

  toggleContactForm() {
    this.showContactForm = !this.showContactForm;
    this.contactSent = false;
  }

  openWhatsApp() {
    window.open('https://wa.me/919226654133', '_blank');
  }

  sendContactForm() {
    if (!this.contactName || !this.contactPhone || !this.contactMessage) return;
    this.contactSending = true;
    const formData = new FormData();
    formData.append('name', this.contactName);
    formData.append('phone', this.contactPhone);
    formData.append('message', this.contactMessage);

    fetch('https://formsubmit.co/ajax/vinitvibhandik77@gmail.com', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        this.contactSending = false;
        this.contactSent = true;
        this.contactName = '';
        this.contactPhone = '';
        this.contactMessage = '';
      })
      .catch(() => {
        this.contactSending = false;
        alert('Failed to send message. Please try again.');
      });
  }

  ngOnInit(): void {
    initializeMatrixEffect();
    this.startOpeningSequence();
    this.startSystemStatus();

    // Observe skills section
    setTimeout(() => {
      const skillsEl = document.querySelector('.skills-section');
      if (skillsEl) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.skillsVisible = true;
              observer.disconnect();
            }
          });
        }, { threshold: 0.3 });
        observer.observe(skillsEl);
      }
    }, 2000);
  }

  startSystemStatus() {
    this.updateStatus();
    this.statusInterval = setInterval(() => this.updateStatus(), 2000);
  }

  updateStatus() {
    this.cpuUsage = Math.floor(Math.random() * 40) + 20;
    this.ramUsage = +(Math.random() * 2 + 1.5).toFixed(1);
    this.networkPing = Math.floor(Math.random() * 30) + 5;
    const threats = ['LOW', 'LOW', 'LOW', 'MODERATE', 'LOW'];
    this.threatLevel = threats[Math.floor(Math.random() * threats.length)];
  }

  startOpeningSequence() {
    if (this.openingText.length < this.fullOpeningText.length) {
      this.openingText += this.fullOpeningText.charAt(this.openingText.length);
      playTypingClick();
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
      playTypingClick();
      setTimeout(() => this.typeIpText(), 100);
    } else {
      setTimeout(() => {
        this.showOpeningSequence = false;
        this.startTypingEffect();
      }, 1000);
    }
  }

  toggleAudio() {
    this.audioEnabled = toggleAmbientDrone();
  }

  ngOnDestroy() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.remove();
    }
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
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
    }, 400);
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
