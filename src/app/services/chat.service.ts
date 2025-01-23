import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.addMessage(
      'Olá! Sou seu assistente virtual especializado em carros. Como posso ajudar você hoje?',
      false
    );
  }

  sendMessage(message: string): void {
    this.loadingSubject.next(true);
    this.addMessage(message, true);

    this.http.post<{ response: string }>(`${this.apiUrl}/chat-autocar/message`, { message })
      .pipe(
        catchError(error => {
          console.error('Error sending message:', error);
          this.addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.', false);
          this.loadingSubject.next(false);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        if (response?.response) {
          this.addMessage(response.response, false);
        }
      });
  }

  private addMessage(content: string, isUser: boolean) {
    const messages = this.messagesSubject.value;
    const newMessage: ChatMessage = {
      content,
      isUser,
      timestamp: new Date()
    };
    this.messagesSubject.next([...messages, newMessage]);
  }
}
