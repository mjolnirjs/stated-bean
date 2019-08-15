import { StatedBeanMetaStorage } from './storage';

export function getMetadataStorage(): StatedBeanMetaStorage {
  return (
    (window as any).StateBeanMetadataStorage ||
    ((window as any).StateBeanMetadataStorage = new StatedBeanMetaStorage())
  );
}

export * from './storage';
