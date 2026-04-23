export type Rank =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

export type Suit = "s" | "h" | "d" | "c";

export type Card = {
  rank: Rank;
  suit: Suit;
  code: `${Rank}${Suit}`;
};
