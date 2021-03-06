import * as Rx from 'rx';
import RxChannel from './RxChannel';
import {Connection, Channel, Options} from 'amqplib';

/**
 * Connection to AMQP server.
 */
export default class RxConnection {
  /**
   * Class constructor
   *
   * @param connection
   */
  constructor(private connection: Rx.Observable<Connection>) {
  }

  /**
   * Opens a channel. May fail if there are no more channels available.
   *
   * @returns {any}
   */
  public createChannel(): Rx.Observable<RxChannel> {
    return this.connection
      .flatMap((conn: Connection) => conn.createChannel())
      .map((channel: Channel) => new RxChannel(channel));
  }

  /**
   * Close the connection cleanly. Will immediately invalidate any unresolved operations, so it's best to make sure
   * you've done everything you need to before calling this. Will be resolved once the connection, and underlying
   * socket, are closed.
   *
   * @returns {any}
   */
  public close() {
    return this.connection
      .flatMap((conn: Connection) => conn.close())
      .map(() => this);
  }
}
