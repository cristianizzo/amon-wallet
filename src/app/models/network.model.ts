export interface NetworkModel {
  id?: number;
  name: string;
  rpc: string;
  chainId: number;
  explorer: string;
  symbol: string;
  testnet?: boolean;
  default?: boolean;
}