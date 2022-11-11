export class CoingeckoTickerModel {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
    has_trading_incentive: boolean;
  };
  last: number;
  volume: number;
  'trust_score': string;
  'bid_ask_spread_percentage': number;
  timestamp: string;
  'coin_id': string;
}
