
Wrapper around node-fetch for doing json requests.

## Usage


`yarn install rhx --save`

```
    import { Xhr } from 'rhx';

    let xhr = new Xhr('http://myapi.com', {
        'Custom Header': 'added to all requests'
    });

    xhr.json('/myendpoint', { /* node-fetch options*/
      headers: { /* custom headers */ },
      body: xhr.form({ /* form data as json */ });
    });
    // returns promise of a response

```
    
## Interface

```
    export interface IXhr {
      json<A>(url: string, opts?: any): Promise<A | undefined>;
      form(data: any): any;
      headers(url: string): Promise<any>
    };

```
