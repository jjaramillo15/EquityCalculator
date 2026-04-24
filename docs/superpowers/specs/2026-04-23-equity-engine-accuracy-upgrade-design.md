# Equity Engine Accuracy Upgrade Design

Date: 2026-04-23
Status: Draft approved in conversation, awaiting written spec review

## 1. Goal

Improve the current Hold'em equity engine so it produces noticeably more credible results while keeping the interaction fast enough for browser-driven study workflows.

This upgrade focuses on practical accuracy for two- and three-player spots using both fixed hands and text ranges. The target is not solver-grade precision; it is a clear step up from the current placeholder logic while preserving responsiveness.

## 2. Scope

This slice includes:

- Better approximate equity calculation for 2-3 players
- Support for fixed hands and parsed text ranges in the same calculation
- Strict blocked-card handling against fixed hands and partial board cards
- Partial board completion during simulation
- Real 7-card showdown evaluation with category-aware hand ranking
- Tie splitting in final equity output

This slice does not include:

- Exact exhaustive enumeration
- Weighted combos or weighted ranges
- More than 3 players as a high-quality target
- Advanced range syntax beyond what the current parser can expand
- UI changes other than consuming the improved result quality

## 3. Product Constraints

- Results must remain fast enough for repeated recalculation from the workspace
- Card blocking must be enforced strictly
- Partial boards must be respected
- The external `calculateEquity()` contract should stay stable
- The engine should continue living under `src/lib/poker` as a reusable domain module

## 4. Recommended Technical Direction

Use a Monte Carlo engine with legal combo sampling rather than string comparison or exact enumeration.

For each iteration:

1. Reserve all known fixed-hand cards and board cards.
2. Expand each player's range into legal two-card combos.
3. Sample one legal combo per ranged player without collisions.
4. Complete the remaining board cards from the undealt deck.
5. Evaluate every player's best 5-card hand from 7 cards.
6. Award win or tie shares.

This keeps the engine approximate, but grounds every sample in an actual valid Hold'em state.

## 5. Component Design

### 5.1 `src/lib/poker/hand-evaluator.ts`

Replace the current max-rank placeholder with a deterministic 7-card evaluator that:

- Recognizes high card, pair, two pair, trips, straight, flush, full house, quads, and straight flush
- Handles ace-high and wheel straights
- Returns a comparable numeric score where category outranks kickers

The evaluator does not need to expose every intermediate classification detail to callers. A stable comparable score is enough for this MVP.

### 5.2 `src/lib/poker/equity-engine.ts`

Rework the engine so it:

- Validates the supported player count target of 2-3 players
- Converts fixed hands directly into reserved combos
- Converts range text into candidate hand classes, then into concrete combos
- Filters out blocked combos from board and previously reserved cards
- Samples one legal combo per ranged player per iteration
- Completes the board from the remaining deck
- Evaluates showdown and distributes win/tie shares

The public function should continue returning:

```ts
{
  players: Array<{ label: string; equity: number }>;
}
```

## 6. Sampling Rules

Sampling must follow these rules:

- Fixed hands are locked in first
- Any combo conflicting with board or fixed cards is discarded
- Ranged players must be sampled from currently legal combos only
- If a player has zero legal combos in a sampled state, discard that iteration and resample
- Missing board cards are drawn from the undealt deck without duplicates

This keeps every Monte Carlo iteration valid instead of merely plausible.

## 7. Performance Boundaries

The engine should optimize for responsiveness rather than maximum precision:

- Stay approximate with bounded iterations
- Avoid repeated expensive recomputation inside each iteration when data can be prepared once
- Support 2-3 players as the high-quality target
- Allow 4+ players to remain out of scope or clearly degraded later, but do not silently pretend they are equally accurate

## 8. Testing Strategy

### 8.1 Hand evaluator tests

Add tests that prove:

- Pair beats high card
- Two pair beats one pair
- Flush beats straight
- Full house beats flush
- Straight flush beats quads
- Kickers break ties correctly
- Wheel straight is recognized correctly

### 8.2 Equity engine tests

Add tests that prove:

- Fixed-hand heads-up calculations produce stable ordering such as `AA` outperforming `KK`
- Board-aware calculations respect known community cards
- Ties are split across players
- Range-versus-range calculations filter blocked combos correctly
- Unsupported player counts are rejected clearly or constrained explicitly

## 9. Success Criteria

This slice is successful when:

- The engine no longer compares raw strings to choose winners
- Showdown ranking is based on real Hold'em hand categories
- Board and dead-card blocking are enforced strictly
- Fixed hands and ranges both produce believable outcomes
- The workspace continues to feel responsive for 2-3 player spots
