export const ResourceTypes = ['script', 'image', 'stylesheet', 'font', 'fetch', 'document'];

export type ResourceType = keyof typeof ResourceTypes;

export interface Resource {
  url: string;
  type: ResourceType;
  size: number;
  error: string;
}