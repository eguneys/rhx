import test from 'ava';
import { Stream } from '../stream';

let stream = new Stream('https://lichess.org');

test.cb('stream current games', t => {
  stream.ndjson('/api/tv/feed')
    .then(({ response }) => {

      response.on('data', e => {
        t.like(e, { t: 'featured' });
        t.end();
      })


      setTimeout(() => t.end('timeout'), 5000);
    });
});
