import { Page, Request } from 'playwright';

const ResourceTypes = ['script', 'image', 'stylesheet', 'font', 'fetch', 'document'];

export class PlaywrightChunks {
  private _page: Page;
  private _resources: any[] = [];
  private _requestListener: any = null;
  private _sameOrigin = false;

  constructor (page: Page) {
    this._page = page;
  }

  start({ resourceTypes, sameOrigin } = { resourceTypes: ResourceTypes, sameOrigin: false }) {
    this._sameOrigin = sameOrigin;
    this._page.on('request', this._requestListener = (request: Request) => {
      const isResourceType = resourceTypes.includes(request.resourceType());
      if (isResourceType) {
        this._resources.push(request);
      }
    })
  }

  async stop() {
    await this._page.off('request', this._requestListener);
    const data = this._process();
    this._reset();
    return data;
  }

  private async _process() {
    const resources = this._sameOrigin ? 
      this._resources.filter(request => request.url().includes(this._hostname())) : 
      this._resources;

    return Promise.all(resources.map(async request => {
      const url = request.url();
      let error = '';
      let body = '';

      try {
        const response = await request.response();
        body = await response.body();
      } catch (e) {
        error = e.message;
      }

      return Promise.resolve({
        url,
        type: request.resourceType(),
        size: body.toString().length,
        error
      })
    }));
  }

  private _reset() {
    this._resources = [];
    this._requestListener = null;
  }

  private _hostname() {
    return new URL(this._page.url()).host;
  }
}