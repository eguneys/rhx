import test from 'ava';
import { Websocket, Emit } from '../ws';

test.cb('echo websocket', t => {

  let ws = new Websocket({
    baseUrl: 'wss://echo.websocket.org',
    setSend: (send: Emit) => {
      send('Hello world!');
    },
    receive: (receive: string) => {
      if (receive === 'Hello world!') {
        t.end();
      }
    }
  });


  ws.connect('/').then(() => t.end('closed'));

  setTimeout(() => t.end('timeout'), 5000);
  
});
