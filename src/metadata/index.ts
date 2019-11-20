import { StatedBeanMetaStorage } from './storage';

let StateBeanMetaStorage: StatedBeanMetaStorage | undefined;

export const getMetadataStorage = () => StateBeanMetaStorage || (StateBeanMetaStorage = new StatedBeanMetaStorage());

export * from './storage';
