import { StatedBeanMetaStorage } from './storage';

export function getMetadataStorage(): StatedBeanMetaStorage {
  return (
    (<any>window).StateBeanMetadataStorage ||
    ((<any>window).StateBeanMetadataStorage = new StatedBeanMetaStorage())
  );
}

export * from './storage';
