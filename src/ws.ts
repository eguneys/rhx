const WebsocketClient = require('websocket').client;

export type WebsocketOptions = {
  endpoint: string,
  headers?: string,
  setSend: (_: Emit) => void,
  receive: Emit
}

export class Websocket {

  ws: typeof WebsocketClient

  fuConnection: Promise<void>
  
  get url(): string {
    return this.opts.endpoint
  }

  get headers(): string {
    return this.opts.headers || '';
  }

  constructor(readonly opts: WebsocketOptions) {

    this.ws = new WebsocketClient();

    this.fuConnection = new Promise((resolve, reject) => {
      this.ws.on('connect', (connection: any) => {
        connection.on('close', () => {
          reject('websocket closed ' + this.url);
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


  connect() {
    let protocols: any = [],
    origin = null;
    
    this.ws.connect(this.url, protocols, origin, this.headers);

    return this.fuConnection;
  }
  
}

export type Emit = (msg: string) => void
