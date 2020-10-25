import { Page } from 'playwright';
import { Chunks } from './chunks';

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
    chunks.start({
      resourceTypes: ['script'],
      sameOrigin: true
    });
    
    await this._page.goto(this._initialUrl);

    await this._page.waitForNavigation

    await this._page.goto(this._toUrl);
    
    const resources = await chunks.stop();
    return resources;
  }
}
