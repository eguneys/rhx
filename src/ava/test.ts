import test from 'ava';
import { Stream } from '../stream';

let stream = new Stream('https://lichess.org');

test('stream current games', async t => {
  
  await new Promise((resolve, reject) =>
    stream.ndjson('/api/tv/feed')
      .then(({ response }) => {
        setTimeout(() => reject('timeout'), 5000);
        response.on('data', e => {
          t.like(e, { t: 'featured' });
          resolve(undefined);
        })

      }));
});
