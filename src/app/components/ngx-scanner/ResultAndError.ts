import { Exception, Result } from '@zxing/library';

export interface ResultAndError {
  result?: Result;
  error?: Exception;
}
