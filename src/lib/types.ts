export interface MarketLevel {
  price: number;
  quantity: number;
}

export interface MarketSnapshot {
  bids: MarketLevel[];
  asks: MarketLevel[];
}
