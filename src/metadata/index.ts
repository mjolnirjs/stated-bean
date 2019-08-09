import { StatedBeanMetaStorage } from './storage';

export function getMetadataStorage(): StatedBeanMetaStorage {
  if (window.StateBeanMetadataStorage === undefined) {
    window.StateBeanMetadataStorage = new StatedBeanMetaStorage();
  }

  return window.StateBeanMetadataStorage;
}

export * from './storage';
