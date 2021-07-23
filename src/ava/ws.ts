import test from 'ava';
import { Websocket, Emit } from '../ws';
import { pTimeout } from './_util';

test('csgo websocket', async t => {

  t.timeout(30000);

  let ws = new Websocket({
    baseUrl: 'ws://localhost:3000',
    setSend: (send: Emit) => {},
    receive: (receive: string) => {}
  });

  try {
    await Promise.race([
      ws.connect('/matchmaker/csgo/socket/v5?sri=klsajdff'),
      pTimeout(40000)
    ]);
  } catch (e) {
    t.is(e, 'websocket closed ws://localhost:3000');
  }
});

test('echo websocket', async t => {

  t.timeout(5000);

  let receive: Emit = () => {};

  let pPass = new Promise<void>(resolve => {
    receive = (receive: string) => {
      t.is(receive, 'Hello world!');
      resolve();
    };
  });
  
  let ws = new Websocket({
    baseUrl: 'wss://echo.websocket.org',
    setSend: (send: Emit) => {
      send('Hello world!');
    },
    receive
  });

  try {
    await Promise.race([
      pPass,
      ws.connect('/'),
      pTimeout(4000)
    ])
  } catch (e) {
    t.fail(e)
  }
});
