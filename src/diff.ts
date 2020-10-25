import { Page } from 'playwright';
import { Chunks } from './chunks';
import { Resource } from './typings';

export class Diff {
  private _page: Page;
  private _initialUrl: string;
  private _toUrl: string;
  
  constructor({ 
    page,
    initialUrl,
    toUrl
  }: {
    page: Page;
    initialUrl: string;
    toUrl: string;
  }) {
    this._page = page;
    this._initialUrl = initialUrl;
    this._toUrl = toUrl;
  }
  
  async compare(): Promise<any> {
    const chunks = new Chunks(this._page);
    const data = [{
      url: this._initialUrl,
      resources: []
    }, {
      url: this._toUrl,
      resources: []
    }];
    
    return Promise.all(data.map(async d => {
      let resources: any = [];
      try {
        resources = await this._getChunks(chunks, d.url);
      } catch (e) {}
      return Promise.resolve({
        ...d,
        resources
      })
    }));
  }
  
  private async _getChunks(chunks: Chunks, url: string): Promise<Resource[]> {
    chunks.start({
      resourceTypes: ['script'],
      sameOrigin: true
    });
    
    await this._page.goto(url);
    
    return await chunks.stop();
  }
}
