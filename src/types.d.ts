import { PortableTextBlock } from '@portabletext/types';

export type FileJson = {
  title: string;
  id: string;
  blocks: Blocks;
};

export type Blocks = Array<Block>;

export type Block = PortableTextBlock;
