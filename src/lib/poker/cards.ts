import { z } from "zod";
import type { Card, Rank, Suit } from "./types";

const cardCodeSchema = z.string().regex(/^[AKQJT98765432][shdc]$/);

const ranks: Rank[] = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const suits: Suit[] = ["s", "h", "d", "c"];

export function parseCard(code: string): Card {
  cardCodeSchema.parse(code);

  return {
    rank: code[0] as Rank,
    suit: code[1] as Suit,
    code: code as Card["code"],
  };
}

export function allCards(): Card[] {
  return ranks.flatMap((rank) =>
    suits.map((suit) => parseCard(`${rank}${suit}`)),
  );
}

export function unavailableCards(
  board: string[],
  fixedHands: string[][],
): string[] {
  return [...new Set([...board, ...fixedHands.flat()])].sort();
}
