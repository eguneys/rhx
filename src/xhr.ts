import { Readable } from 'stream';

export interface IXhr {
  json<A>(url: string, opts?: any): Promise<A | undefined>;
  form(data: any): any;
  headers(url: string): Promise<any>
};

export const defaultInit: RequestInit = {
  cache: 'no-cache',
  credentials: 'same-origin'
};

export const xhrHeader = {
  'X-Requested-With': 'XMLHttpRequest'
};


export class Xhr implements IXhr {

  baseUrl: string
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  text(url: string, init: RequestInit = {}): Promise<any> {
    return this.raw(url, init).then(res => {
      if (res.ok) return res.text();
      return res.text()
        .then((_: any) => { throw _ });
    });
  }
  
  json(url: string, init: RequestInit = {}): Promise<any> {
    return this.raw(url, init).then(res => {
      if (res.ok) return res.json();
      return res.json()
        .then((_: any) => { throw _});
    });
  }
  
  raw(url: string, init: RequestInit = {}): Promise<any> {
    let { headers, ...rest } = init;
    
    return fetch(this.baseUrl + url, {
      ...defaultInit,
      headers: {
        ...xhrHeader,
        ...headers
      },
      ...rest
    } as any);
  }

    
  form(data: any): any {
    const form = new FormData();
    for (let key in data) {
      form.append(key, data[key]);
    }
    return form
  }

  headers(url: string) {
    return fetch(this.baseUrl + url, {
      redirect: 'manual'
    })
      .then(_ => {
        return _.headers.values();
      });
  }

  headersAndJson(url: string) {
    return fetch(this.baseUrl + url, {
      redirect: 'manual'
    })
      .then(async _ => {
        let headers = await _.headers.values(),
        body = await _.json();

        if (_.ok) return {
          headers,
          body
        }
      });
  }
}
