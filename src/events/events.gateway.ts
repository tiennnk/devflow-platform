import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: string) {
    return 'pong: ' + data;
  }

  emitTaskCreated(task: { id: number; title: string; status: string }) {
    this.server.emit('task:created', task);
  }

  emitTaskUpdated(task: { id: number; title: string; status: string }) {
    this.server.emit('task:updated', task);
  }
}
