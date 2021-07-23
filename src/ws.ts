const WebsocketClient = require('websocket').client;

export type WebsocketOptions = {
  baseUrl: string,
  headers?: object,
  setSend: (_: Emit) => void,
  receive: Emit
}

export class Websocket {

  ws: typeof WebsocketClient

  fuConnection: Promise<void>
  
  get baseUrl(): string {
    return this.opts.baseUrl
  }

  get headers(): object {
    return this.opts.headers || {};
  }

  constructor(readonly opts: WebsocketOptions) {

    this.ws = new WebsocketClient();

    this.fuConnection = new Promise((resolve, reject) => {

      this.ws.on('connectFailed', (desc: string) => {
        reject('websocket connect failed' + desc);
      });
      
      this.ws.on('connect', (connection: any) => {
        connection.on('close', () => {
          reject('websocket closed ' + this.baseUrl);
        });

        connection.on('message', (data: any) => {
          this.opts.receive(data.utf8Data);
        });

        function sendRaw(data: string) {
          connection.sendUTF(data);
        }
        
        this.opts.setSend(sendRaw);
      });
    });

  }


  connect(endpoint: string, headers?: object) {
    let protocols: any = [],
    origin = null;
    
    this.ws.connect(this.baseUrl + endpoint, protocols, origin, {
      ...this.headers,
      ...headers
    });

    return this.fuConnection;
  }
  
}

export type Emit = (msg: string) => void
