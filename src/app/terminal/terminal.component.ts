import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  standalone: true
})
export class TerminalComponent implements OnInit, OnDestroy {
  terminal: Terminal;
  fitAddon: FitAddon;
  inputBuffer: string = '';
  @Output() terminalClosed: EventEmitter<void> = new EventEmitter();

  constructor() {
    this.terminal = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#000000',
        foreground: '#00ff00',
      },
    });
    this.fitAddon = new FitAddon();
  }

  ngOnInit(): void {
    const terminalElement = document.getElementById('terminal');
    if (terminalElement) {
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(terminalElement);
      this.fitAddon.fit();
      this.initializeCommands();
      this.makeTerminalDraggable()
    }
  }

  ngOnDestroy(): void {
    this.terminal.dispose();
  }

  makeTerminalDraggable(): void {
    const terminalWrapper = document.getElementById('terminalWrapper');
    const terminalHeader = document.getElementById('terminalHeader');

    if (terminalWrapper && terminalHeader) {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      terminalHeader.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - terminalWrapper.offsetLeft;
        offsetY = event.clientY - terminalWrapper.offsetTop;
        document.body.style.cursor = 'move';
      });

      document.addEventListener('mousemove', (event) => {
        if (isDragging) {
          const newX = event.clientX - offsetX;
          const newY = event.clientY - offsetY;
          terminalWrapper.style.left = `${newX}px`;
          terminalWrapper.style.top = `${newY}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default';
      });
    }
  }

  initializeCommands(): void {
    const directories: { [key: string]: string[] } = {
      home: ['projects', 'contact', 'about'],
      projects: ['Project 1', 'Project 2', 'Project 3'],
      contact: ['Vinit_Vibhandik', 'vinitvibhandik77@gmail.com'],
      about: ['education', 'experience', 'certifications']
    };

    let currentDirectory = 'home';

    this.terminal.writeln("Welcome to Vinit_Vibhandik's Portfolio Terminal!");
    this.terminal.writeln('Type "help" for a list of commands.');

    const updatePrompt = () => {
      this.terminal.write(`\r\n\x1b[32mC:\\Users\\Vinit_Vibhandik\\${currentDirectory}>\x1b[0m `);
    };

    updatePrompt();

    this.terminal.onData((input) => {
      if (input === '\r') {
        const command = this.inputBuffer.trim();
        this.inputBuffer = '';
        this.executeCommand(command, directories, currentDirectory);
      } else if (input === '\u007F') {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.terminal.write('\b \b');
      } else {
        this.inputBuffer += input;
        this.terminal.write(`\x1b[36m${input}\x1b[0m`);
      }
    });
  }

  executeCommand(command: string, directories: { [key: string]: string[] }, currentDirectory: string): void {
    switch (command) {
      case 'help':
        this.terminal.writeln('\r\n\x1b[36mList of commands:\x1b[0m');
        this.terminal.writeln('  help              - List available commands');
        this.terminal.writeln('  ls                - List files/directories');
        this.terminal.writeln('  cat <file>        - Read the contents of a file');
        this.terminal.writeln('  cd <dir>          - Change directory');
        this.terminal.writeln('  whoami            - Display current user info');
        this.terminal.writeln('  neofetch          - Display system information');
        this.terminal.writeln('  download resume   - Download resume (PDF)');
        this.terminal.writeln('  clear             - Clear terminal');
        this.terminal.writeln('  exit              - Close terminal');
        break;

      case 'ls':
        if (directories[currentDirectory]) {
          this.terminal.writeln('\r\n' + directories[currentDirectory].join('\r\n'));
        } else {
          this.terminal.writeln(`\r\nNo files or directories found in ${currentDirectory}`);
        }
        break;

      case 'clear':
        this.terminal.clear();
        break;

      case 'exit':
        this.terminal.dispose();
        this.terminalClosed.emit();
        break;

      case 'whoami':
        this.terminal.writeln('\r\nVinit Vibhandik - Aspiring DevOps and Cloud Engineer');
        this.terminal.writeln('Passionate about competitive coding and backend development.');
        break;

      case 'neofetch':
        this.terminal.writeln('\r\n\x1b[32m __      __ __      __\x1b[0m');
        this.terminal.writeln('\x1b[32m \\ \\    / / \\ \\    / /\x1b[0m');
        this.terminal.writeln('\x1b[32m  \\ \\  / /   \\ \\  / / \x1b[0m');
        this.terminal.writeln('\x1b[32m   \\ \\/ /     \\ \\/ /  \x1b[0m');
        this.terminal.writeln('\x1b[32m    \\  /       \\  /   \x1b[0m');
        this.terminal.writeln('\x1b[32m     \\/         \\/    \x1b[0m');
        this.terminal.writeln('');
        this.terminal.writeln('\x1b[36m  vinit@portfolio\x1b[0m');
        this.terminal.writeln('  ─────────────────');
        this.terminal.writeln('  \x1b[33mOS:\x1b[0m      Portfolio v2.0');
        this.terminal.writeln('  \x1b[33mHost:\x1b[0m    Vercel Cloud');
        this.terminal.writeln('  \x1b[33mShell:\x1b[0m   Angular 17 / TypeScript');
        this.terminal.writeln('  \x1b[33mTheme:\x1b[0m   Matrix Neon [Dark]');
        this.terminal.writeln('  \x1b[33mSkills:\x1b[0m  Python, C++, OCI, Docker');
        this.terminal.writeln('  \x1b[33mCerts:\x1b[0m   6x Oracle Certified');
        this.terminal.writeln('  \x1b[33mCollege:\x1b[0m JSPM RSCOE - BTech IT');
        this.terminal.writeln('  \x1b[33mUptime:\x1b[0m  Since Jan 2026');
        this.terminal.writeln('');
        this.terminal.writeln('  \x1b[41m  \x1b[42m  \x1b[44m  \x1b[45m  \x1b[43m  \x1b[46m  \x1b[47m  \x1b[0m');
        break;

      case 'download resume':
        this.terminal.writeln('\r\n\x1b[33mInitializing download...\x1b[0m');
        this.terminal.writeln('\x1b[32mResume download started!\x1b[0m');
        // Create a link to download. Update the href to your actual resume URL.
        const link = document.createElement('a');
        link.href = './assets/Vinit_Vibhandik_Resume.pdf';
        link.download = 'Vinit_Vibhandik_Resume.pdf';
        link.click();
        break;

      default:
        if (command.startsWith('echo ')) {
          this.terminal.writeln(`\r\n${command.substring(5)}`);
        }
        else if (command.startsWith('cat ')) {
          const file = command.substring(4);
          if (file === 'Project 1' || file === 'Project 2' || file === 'Project 3') {
            this.terminal.writeln(`\r\n\x1b[33mOpening details for ${file}... (In a real app, this would fetch data from an API)\x1b[0m`);
          } else if (file === 'Vinit_Vibhandik') {
            this.terminal.writeln('\r\n\x1b[36mFetching profile data...\r\nName: Vinit Vibhandik\r\nRole: Cloud & DevOps Engineer\x1b[0m');
          } else if (file === 'education') {
            this.terminal.writeln('\r\n\x1b[36m[EDUCATION]\x1b[0m');
            this.terminal.writeln('🎓 \x1b[32mBTech Information Technology\x1b[0m - JSPM\'s Rajarshi Shahu College of Engineering (Sep 2025 - Sep 2029)');
            this.terminal.writeln('🎓 \x1b[32m12th Science PCM (82.33%)\x1b[0m - Chhatrapati Shivaji junior science college (2025 - Present)');
          } else if (file === 'experience') {
            this.terminal.writeln('\r\n\x1b[36m[EXPERIENCE]\x1b[0m');
            this.terminal.writeln('💼 \x1b[32mCampus Ambassador\x1b[0m @ Naukri.com (Jan 2026 - Present)');
            this.terminal.writeln('💼 \x1b[32mTechnical Team Member\x1b[0m @ RSCOE Mathematics Club (Oct 2025 - Present)');
          } else if (file === 'certifications') {
            this.terminal.writeln('\r\n\x1b[36m[CERTIFICATIONS]\x1b[0m');
            this.terminal.writeln('📜 \x1b[33mOracle Data Platform 2025 Certified Foundations Associate\x1b[0m');
            this.terminal.writeln('📜 \x1b[33mOracle Cloud Infrastructure 2025 Certified Generative AI Professional\x1b[0m');
            this.terminal.writeln('📜 \x1b[33mOracle AI Vector Search Certified Professional\x1b[0m');
            this.terminal.writeln('📜 \x1b[33mOracle Cloud Infrastructure 2025 Certified AI Foundations Associate\x1b[0m');
            this.terminal.writeln('📜 \x1b[33mJPMorgan Chase & Co. Software Engineering Job Simulation\x1b[0m');
            this.terminal.writeln('📜 \x1b[33mOracle Cloud Infrastructure 2025 Certified Data Science Professional\x1b[0m');
          } else {
            this.terminal.writeln(`\r\n\x1b[31mcat: ${file}: No such file or directory\x1b[0m`);
          }
        }
        else if (command.startsWith('cd ')) {
          const targetDir = command.split(' ')[1];
          if (directories[targetDir]) {
            currentDirectory = targetDir;

            if (targetDir === 'contact') {
              const email = 'vinitvibhandik77@gmail.com';
              window.location.href = `mailto:${email}`;
              this.terminal.writeln(`\r\nOpening email client to: ${email}`);
            }
            else if (targetDir === 'projects') {
              const githubUrl = 'https://github.com/Vinit-vibhandik22';
              window.open(githubUrl, '_blank');
              this.terminal.writeln(`\r\nOpening GitHub page: ${githubUrl}`);
            } else {
              this.terminal.writeln(`\r\nChanged directory to ${targetDir}`);
            }
          } else {
            this.terminal.writeln(`\r\n\x1b[31mDirectory "${targetDir}" not found.\x1b[0m`);
          }
        } else {
          this.terminal.writeln(`\r\n\x1b[31m'${command}' is not recognized as an internal or external command.\x1b[0m`);
        }
        break;
    }

    const updatePrompt = () => {
      this.terminal.write(`\r\n\x1b[32mC:\\Users\\Vinit_Vibhandik\\${currentDirectory}>\x1b[0m `);
    };

    updatePrompt();
  }
}
