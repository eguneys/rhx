import fetch from 'node-fetch';
import FormData from 'form-data';

export interface IXhr {
  json<A>(url: string, opts?: any): Promise<A | undefined>;
  form(data: any): any;
  headers(url: string): Promise<any>
};

export const jsonHeader = {
};

export const defaultInit: RequestInit = {
  cache: 'no-cache',
  credentials: 'same-origin'
};

export const xhrHeader = {
  'X-Requested-With': 'XMLHttpRequest'
};


export class Xhr implements IXhr {

  jsonHeader: any
  baseUrl: string
  
  constructor(baseUrl: string, jsonHeader: any) {
    this.baseUrl = baseUrl;
    this.jsonHeader = jsonHeader;
  }

  json(url: string, init: RequestInit = {}): Promise<any> {
    let { headers, ...rest } = init;
    
    return fetch(this.baseUrl + url, {
      ...defaultInit,
      headers: {
        ...this.jsonHeader,
        ...xhrHeader,
        ...headers
      },
      ...rest
    } as any).then(res => {
      if (res.ok) return res.json();
      return res.json()
        .then(_ => { throw _});
    });
  }
    
  form(data: any): any {
    const form = new FormData();
    for (let key in data) {
      form.append(key, data[key]);
    }
    return form;
  }

  headers(url: string) {
    return fetch(this.baseUrl + url, {
      redirect: 'manual'
    })
      .then(_ => {
        return _.headers.raw();
      });
  }
}
