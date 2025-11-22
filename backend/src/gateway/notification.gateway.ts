import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

interface Notification {
  id?:number;
  title: string;
  message: string;
  type?: string;
  date?: string;
}

export class NotificationGateway {
  private server: Server;

  constructor(socketServer: Server) {
    this.server = socketServer;
    this.setupConnection();
  }

  private setupConnection(): void {
    this.server.on('connection', (socket) => {
      console.log('Client connecté:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client déconnecté:', socket.id);
      });
    });
  }



  emitNotification(notification: Notification): void {
    console.log('Envoi notification:', notification);
    this.server.emit('notification', notification);
  }

  emitNotifRegisterToAdmin(notifRegister: Notification): void {
    console.log('Envoi notifRegister:', notifRegister);
    this.server.emit('notifRegister', notifRegister);
  }

  emitNotificationMessage(payload: any): void {
    console.log('Envoi notification message:', payload);
    this.server.emit('notificationMessageAdmin', payload);
  }
}

