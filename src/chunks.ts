import { Page, Request } from 'playwright';
import { ResourceTypes, ResourceType, Resource } from './typings';

export class Chunks {
  private _page: Page;
  private _resources: Request[] = [];
  private _listener: (request: Request) => void = () => ({});
  private _sameOrigin = false;

  constructor(page: Page) {
    this._page = page;
  }

  start({ resourceTypes, sameOrigin } = { resourceTypes: ResourceTypes, sameOrigin: false }): void {
    this._sameOrigin = sameOrigin;
    this._page.on(
      'request',
      (this._listener = (request: Request) => {
        const isResourceType = resourceTypes.includes(request.resourceType());
        if (isResourceType) {
          this._resources.push(request);
        }
      }),
    );
  }

  async stop(): Promise<Resource[]> {
    await this._page.off('request', this._listener);
    const data = this._process();
    this._reset();
    return data;
  }

  private async _process(): Promise<Resource[]> {
    const resources = this._sameOrigin
      ? this._resources.filter((request) => request.url().includes(this._hostname()))
      : this._resources;

    return Promise.all(
      resources.map(async (request) => {
        const url = request.url();
        let error = '';
        let body: string | Buffer = '';

        try {
          const response = await request.response();
          if (response) {
            body = await response.body();
          }
        } catch (e) {
          error = e.message;
        }

        return Promise.resolve({
          url,
          type: request.resourceType() as ResourceType,
          size: body.toString().length,
          error,
        });
      }),
    );
  }

  private _reset(): void {
    this._resources = [];
    this._listener = () => ({});
  }

  private _hostname(): string {
    return new URL(this._page.url()).host;
  }
}
