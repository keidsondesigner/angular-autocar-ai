import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService, ChatMessage } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm relative">
        <!-- Chat Messages -->
        <div #chatContainer class="h-[500px] overflow-y-auto p-6 space-y-4" (scroll)="onScroll()">
          <div *ngFor="let message of messages$ | async" 
               [class.text-right]="message.isUser"
               class="animate-fade-in">
            <div [class]="message.isUser ? 
                         'bg-primary text-primary-foreground ml-auto' : 
                         'bg-secondary text-secondary-foreground mr-auto'"
                 class="inline-block rounded-lg px-4 py-2.5 max-w-[80%] shadow-sm">
              <p class="whitespace-pre-wrap leading-7">
                {{ message.content }}
              </p>
              <span class="text-xs opacity-70 block mt-1.5">
                {{ message.timestamp | date:'shortTime' }}
              </span>
            </div>
          </div>
          <div *ngIf="isLoading" class="flex justify-center py-4">
            <div class="animate-pulse flex space-x-3">
              <div class="w-2.5 h-2.5 rounded-full bg-primary/70"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-primary/70 animation-delay-200"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-primary/70 animation-delay-400"></div>
            </div>
          </div>
        </div>

        <!-- Scroll to Bottom Button -->
        <button *ngIf="showScrollButton"
                (click)="scrollToBottom()"
                class="absolute bottom-20 right-6 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 animate-fade-in">
          <i class="fas fa-arrow-down"></i>
        </button>

        <!-- Input Area -->
        <div class="border-t p-4 bg-muted/50">
          <div class="flex space-x-2">
            <input
              type="text"
              [(ngModel)]="currentMessage"
              (keyup.enter)="sendMessage()"
              [disabled]="isLoading"
              placeholder="Pergunte sobre os nossos carros disponíveis..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
            >
            <button
              (click)="sendMessage()"
              [disabled]="isLoading || !currentMessage.trim()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <i class="fas fa-paper-plane mr-2"></i>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animation-delay-200 {
      animation-delay: 200ms;
    }
    .animation-delay-400 {
      animation-delay: 400ms;
    }
    `
  ],
})
export class ChatComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages$: Observable<ChatMessage[]>
  currentMessage = '';
  isLoading = false;
  showScrollButton = false;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }

  onScroll() {
    const element = this.chatContainer.nativeElement;
    const atBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50;
    this.showScrollButton = !atBottom;
  }

  scrollToBottom() {
    const element = this.chatContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const message = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    try {
      await this.chatService.sendMessage(message);
    } finally {
      this.isLoading = false;
    }
  }
}