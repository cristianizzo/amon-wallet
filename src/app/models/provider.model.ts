export interface ProviderModel {
  id?: number;
  name: string;
  rpc: string;
  chainId: number;
  explorer: string;
  symbol: string;
  default?: boolean;
}
