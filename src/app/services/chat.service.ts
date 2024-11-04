import { Injectable } from '@angular/core';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  constructor(private firestoreService: FirestoreService) {
    this.genAI = new GoogleGenerativeAI(
      'AIzaSyB80w0O8NYUR0x9rkz0rjPPs4hcThoAmow'
    );
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.addMessage(
      `Olá! Posso ajudar você com informações sobre nossos carros disponíveis. 
        \n O que você gostaria de saber?
      `,
      false
    );
  }

  private addMessage(content: string, isUser: boolean) {
    const messages = this.messagesSubject.value;
    messages.push({
      content,
      isUser,
      timestamp: new Date(),
    });
    this.messagesSubject.next(messages);
  }

  async processMessage(userMessage: string): Promise<void> {
    try {
      const carData = await this.firestoreService.getCarData();

      const prompt = `Você é um assistente especialista em carros muito bem informado. Use as informações do seguinte banco de dados de carros para responder à pergunta do usuário.
      Seja específico e detalhado em suas respostas, mas use apenas as informações disponíveis no banco de dados.
      Se perguntado sobre algo que não está no banco de dados, explique educadamente que você só pode fornecer informações sobre os carros presentes em seu banco de dados.
      
      Formate suas respostas de maneira clara e fácil de ler.

      Carros Disponíveis no Banco de Dados:
      ${JSON.stringify(carData, null, 2)}

      Pergunta do Usuário: ${userMessage}

      Lembre-se de:
      1. Usar apenas fatos fornecido do banco de dados
      2. Ser específico sobre qual carro está discutindo
      3. Formatar preços, especificações e características de forma clara
      4. Se comparar carros, comparar apenas os que estão no banco de dados
      5. Usar marcadores formatação para melhor legibilidade

      FORMATO DE REPOSTA
      Aqui está a lista de carros disponíveis:
      
      1. <strong>Fiat Pulse Impetus Turbo 200 2024</strong>
        Preço: de R$ 129.990 a R$ 144.990
        Especificações:
          Motor: 1.0 Turbo
          Potência: 130 cv
          Transmissão: CVT
          Combustível: Flex
        Consumo:
          Cidade: 11.3 km/l
          Estrada: 13.2 km/l
        Características:
          Central multimídia de 10.1"
          Teto bicolor
          Frenagem autônoma
          Alerta de mudança de faixa
          Carregador wireless
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      this.addMessage(response.text(), false);
    } catch (error) {
      console.error('Error ao processar a menssagem:', error);
      this.addMessage(
        'Desculpe, encontrei um erro ao processar a sua mensagem. Por favor, tente novamente.',
        false
      );
    }
  }

  async sendMessage(content: string): Promise<void> {
    this.addMessage(content, true);
    await this.processMessage(content);
  }
}
