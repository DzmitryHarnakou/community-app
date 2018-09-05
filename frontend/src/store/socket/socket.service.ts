import * as openSocket from 'socket.io-client';

import { GameModel, RoomInfo } from 'models';
import { Subject } from 'rxjs';
export class SocketService {
  public rooms: Subject<RoomInfo[]> = new Subject();
  public notifyCountdown: Subject<number> = new Subject();
  public updateLeadersBoard: Subject<string> = new Subject();

  private socket: SocketIOClient.Socket;

  public constructor() {
    this.socket = openSocket('http://localhost:3030');
  }

  public init(games: GameModel[]): void {
    for (const game of games) {
      this.socket.on(
        game.updateRoomsInfoEventName,
        (rooms: RoomInfo[]) => this.rooms.next(rooms)
      );
      this.socket.on(
        game.notifyCountdown,
        (distance: number) => this.notifyCountdown.next(distance)
      );
    }
    this.socket.on('updateLeaders', (appName: string) => this.updateLeadersBoard.next(appName));
  }

  public emitEvent(eventName: string): void {
    this.socket.emit(eventName);
  }

  public emitEventWithOptions(eventName: string, opts?: any): void {
    this.socket.emit(eventName, opts);
  }

  public getRoomUrl(): Promise<string> {
    return new Promise((res, rej) => {
      this.socket.on('redirect', (redirectUrl: string) => res(redirectUrl));
    });
  }
}
