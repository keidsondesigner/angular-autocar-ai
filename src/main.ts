import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ChatComponent } from './app/components/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent],
  template: `
    <div class="min-h-screen py-8 bg-background">
      <header class="text-center mb-12">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary mb-4">
          <i class="fas fa-car mr-3"></i>AutoCar AI
        </h1>
        <p class="text-xl text-muted-foreground leading-7">
          O assistente inteligente da nossa coleção de automóveis 
        </p>
      </header>
      
      <app-chat></app-chat>

      <footer class="text-center mt-12 text-sm text-muted-foreground">
        <p>Desenvolvido em Angular, Firebase & Gemini Ai <i class="fas fa-heart text-red-500"></i> por Keidson 
      </footer>
    </div>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [provideHttpClient()],
});
