import { TokenType, TokenModel } from './token.model';

export class TransferAsset {
  toAddress: string;
  amount: any;
  tokenId?: any;
  tokenType: TokenType;
  token?: TokenModel;
}

export class Transaction {
  to: any;
  from: any;
  data?: any;
  value?: any;
  gasLimit?: any;
  maxFeePerGas?: any;
  maxPriorityFeePerGas?: any;
}
