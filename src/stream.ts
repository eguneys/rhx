import { Readable } from 'node:stream'
import AbortController from 'abort-controller';
import ndjson from 'ndjson';

export interface IStream {
  ndjson(url: string, headers?: any): Promise<StreamingResponse>;
  form(data: any): any;
};

export interface StreamingResponse {
  abort: () => void,
  response: NodeJS.ReadableStream
}

export class Stream implements IStream {

  baseUrl: string
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  ndjson<A>(url: string, opts: any = {}) {

    let controller = new AbortController();

    const abort = () => {
      controller.abort();
    };

    let { headers, ...rest } = opts;

    return fetch(this.baseUrl + url, {
      signal: controller.signal,
      headers: {
        ...headers
      },
      ...rest
    }).then(response => {

      if (!response.ok) {
        throw response.statusText;
      }

      const readableNodeStream = Readable.fromWeb(response.body as any)
      
      return {
        abort,
        response: readableNodeStream.pipe(ndjson.parse())
      };
    });
  }
  
  form(data: any): any {
    const form = new FormData();
    for (let key in data) {
      form.append(key, data[key]);
    }
    return form;
  }
}
