/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import os from 'os';

export const resolveHtmlPath = (
  htmlFileName: string,
  forceLocal?: boolean
): string => {
  const port = process.env.PORT || 1212;
  if (process.env.NODE_ENV === 'development' || forceLocal) {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
};

const appDir = path.resolve(os.homedir(), 'Neutrino');
export const resolvePath = (arr?: Array<string>) =>
  path.resolve(appDir, ...(arr || []));
