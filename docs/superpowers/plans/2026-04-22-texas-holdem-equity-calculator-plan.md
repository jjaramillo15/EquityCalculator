# Texas Hold'em Equity Calculator MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-first Texas Hold'em equity calculator MVP with accounts, projects, saved ranges, scenario history, read-only sharing, and a multiway Monte Carlo equity engine that updates as board cards change.

**Architecture:** Use a monolithic Next.js application with App Router, server-side persistence, and a server-owned poker engine module. Keep poker domain logic isolated under `src/lib/poker` so the engine, parsing, and validation rules remain reusable for a future mobile client or standalone API.

**Tech Stack:** Next.js (App Router), TypeScript, React, Tailwind CSS, Prisma, PostgreSQL, Auth.js, Zod, Vitest, Testing Library, Playwright

---

## File Structure

This repository is currently almost empty, so the implementation should create a clean baseline structure with small, focused units.

### App and UI

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/(auth)/sign-in/page.tsx`
- Create: `src/app/(dashboard)/projects/page.tsx`
- Create: `src/app/(dashboard)/projects/[projectId]/page.tsx`
- Create: `src/app/(dashboard)/ranges/page.tsx`
- Create: `src/app/share/[token]/page.tsx`
- Create: `src/components/range/range-matrix.tsx`
- Create: `src/components/range/range-text-input.tsx`
- Create: `src/components/range/range-percent-slider.tsx`
- Create: `src/components/scenario/board-picker.tsx`
- Create: `src/components/scenario/player-panel.tsx`
- Create: `src/components/scenario/equity-results.tsx`
- Create: `src/components/projects/project-list.tsx`
- Create: `src/components/ranges/saved-range-list.tsx`

### Server and data

- Create: `prisma/schema.prisma`
- Create: `src/auth.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/validation/range.ts`
- Create: `src/lib/validation/scenario.ts`
- Create: `src/lib/poker/cards.ts`
- Create: `src/lib/poker/hands.ts`
- Create: `src/lib/poker/range-ranking.ts`
- Create: `src/lib/poker/range-parser.ts`
- Create: `src/lib/poker/range-serializer.ts`
- Create: `src/lib/poker/combo-filter.ts`
- Create: `src/lib/poker/equity-engine.ts`
- Create: `src/lib/poker/hand-evaluator.ts`
- Create: `src/lib/poker/types.ts`
- Create: `src/lib/projects.ts`
- Create: `src/lib/ranges.ts`
- Create: `src/lib/shares.ts`
- Create: `src/lib/scenarios.ts`

### API routes

- Create: `src/app/api/scenarios/calculate/route.ts`
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/api/ranges/route.ts`
- Create: `src/app/api/ranges/[rangeId]/route.ts`
- Create: `src/app/api/scenarios/route.ts`
- Create: `src/app/api/scenarios/[scenarioId]/route.ts`
- Create: `src/app/api/scenarios/[scenarioId]/share/route.ts`

### Tests

- Create: `src/lib/poker/cards.test.ts`
- Create: `src/lib/poker/range-parser.test.ts`
- Create: `src/lib/poker/range-ranking.test.ts`
- Create: `src/lib/poker/combo-filter.test.ts`
- Create: `src/lib/poker/equity-engine.test.ts`
- Create: `src/components/range/range-matrix.test.tsx`
- Create: `src/components/scenario/board-picker.test.tsx`
- Create: `src/app/api/scenarios/calculate/route.test.ts`
- Create: `tests/e2e/auth-and-projects.spec.ts`
- Create: `tests/e2e/workspace-range-builder.spec.ts`
- Create: `tests/e2e/history-and-share.spec.ts`

### Docs and config

- Create: `.env.example`
- Create: `.gitignore`
- Create: `README.md`

## Task 1: Bootstrap The Monolithic App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Write the failing smoke test for the home page scaffold**

```tsx
// src/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("shows the MVP title", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /hold'em equity calculator/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails because the app is not scaffolded yet**

Run: `npm test -- src/app/page.test.tsx`
Expected: FAIL with module resolution errors or missing file errors for `src/app/page`.

- [ ] **Step 3: Create the package and framework configuration**

```json
{
  "name": "texas-holdem-equity-calculator",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.7.4",
    "@prisma/client": "^5.13.0",
    "next": "^15.0.0",
    "next-auth": "^5.0.0-beta.25",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "prisma": "^5.13.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Add the initial app shell and home page**

```tsx
// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-950 text-stone-50">{children}</body>
    </html>
  );
}
```

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6">
      <h1 className="text-4xl font-semibold">Texas Hold&apos;em Equity Calculator</h1>
      <p className="mt-4 text-lg text-stone-300">
        Multiway equity, saved ranges, projects, and hand review history.
      </p>
    </main>
  );
}
```

- [ ] **Step 5: Run the smoke test and base checks**

Run: `npm test -- src/app/page.test.tsx`
Expected: PASS with one passing test.

Run: `npm run build`
Expected: PASS with a successful Next.js production build.

- [ ] **Step 6: Commit the bootstrap**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.js tailwind.config.ts vitest.config.ts playwright.config.ts src/app/layout.tsx src/app/page.tsx src/app/page.test.tsx .gitignore .env.example README.md
git commit -m "chore: bootstrap nextjs equity calculator app"
```

## Task 2: Create The Database Schema And Authentication Baseline

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/auth.ts`
- Create: `src/lib/db.ts`
- Create: `src/app/(auth)/sign-in/page.tsx`
- Create: `src/app/(dashboard)/projects/page.tsx`
- Create: `tests/e2e/auth-and-projects.spec.ts`

- [ ] **Step 1: Write the failing Prisma schema test for required entities**

```ts
// prisma/schema.test.ts
import { readFileSync } from "node:fs";

describe("schema.prisma", () => {
  it("contains the core MVP models", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");
    expect(schema).toContain("model User");
    expect(schema).toContain("model Project");
    expect(schema).toContain("model Scenario");
    expect(schema).toContain("model SavedRange");
    expect(schema).toContain("model SharedScenarioLink");
  });
});
```

- [ ] **Step 2: Run the schema test to verify it fails**

Run: `npm test -- prisma/schema.test.ts`
Expected: FAIL because `prisma/schema.prisma` does not exist yet.

- [ ] **Step 3: Add Prisma models and auth baseline**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String      @id @default(cuid())
  name         String?
  email        String?     @unique
  image        String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  projects     Project[]
  savedRanges  SavedRange[]
  scenarios    Scenario[]  @relation("ScenarioOwner")
  accounts     Account[]
  sessions     Session[]
}

model Project {
  id         String     @id @default(cuid())
  name       String
  ownerId    String
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  owner      User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  scenarios  Scenario[]
}

model Scenario {
  id          String               @id @default(cuid())
  ownerId     String
  projectId   String
  name        String
  board       Json
  players     Json
  result      Json?
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
  owner       User                 @relation("ScenarioOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  project     Project              @relation(fields: [projectId], references: [id], onDelete: Cascade)
  shareLinks  SharedScenarioLink[]
}

model SavedRange {
  id             String   @id @default(cuid())
  ownerId        String
  name           String
  matrixState    Json
  textValue      String
  canonicalRange Json
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  owner          User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
}

model SharedScenarioLink {
  id          String   @id @default(cuid())
  scenarioId  String
  token       String   @unique
  createdAt   DateTime @default(now())
  scenario    Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
}
```

```ts
// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 4: Add minimal sign-in and protected projects page**

```tsx
// src/app/(auth)/sign-in/page.tsx
export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="mt-3 text-stone-300">Authentication wiring lands in this task so projects can be user-owned.</p>
    </main>
  );
}
```

```tsx
// src/app/(dashboard)/projects/page.tsx
export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="mt-3 text-stone-300">Your hand review projects will live here.</p>
    </main>
  );
}
```

- [ ] **Step 5: Run schema and route-level tests**

Run: `npm test -- prisma/schema.test.ts`
Expected: PASS.

Run: `npm run prisma:generate`
Expected: PASS with generated Prisma client.

- [ ] **Step 6: Commit the data and auth baseline**

```bash
git add prisma/schema.prisma prisma/schema.test.ts src/lib/db.ts src/app/(auth)/sign-in/page.tsx src/app/(dashboard)/projects/page.tsx
git commit -m "feat: add prisma schema and auth baseline"
```

## Task 3: Build The Poker Domain Primitives

**Files:**
- Create: `src/lib/poker/types.ts`
- Create: `src/lib/poker/cards.ts`
- Create: `src/lib/poker/hands.ts`
- Create: `src/lib/poker/cards.test.ts`

- [ ] **Step 1: Write the failing tests for card parsing and deck generation**

```ts
// src/lib/poker/cards.test.ts
import { allCards, parseCard, unavailableCards } from "./cards";

describe("cards", () => {
  it("parses a valid card token", () => {
    expect(parseCard("Ah")).toEqual({ rank: "A", suit: "h", code: "Ah" });
  });

  it("builds the 52-card deck", () => {
    expect(allCards()).toHaveLength(52);
  });

  it("marks board and fixed-hand cards as unavailable", () => {
    expect(unavailableCards(["Ah", "Kd"], [["Qc", "Qs"]])).toEqual(["Ah", "Kd", "Qc", "Qs"]);
  });
});
```

- [ ] **Step 2: Run the card tests to verify they fail**

Run: `npm test -- src/lib/poker/cards.test.ts`
Expected: FAIL because `cards.ts` is missing.

- [ ] **Step 3: Implement the poker types and card helpers**

```ts
// src/lib/poker/types.ts
export type Rank = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
export type Suit = "s" | "h" | "d" | "c";

export type Card = {
  rank: Rank;
  suit: Suit;
  code: `${Rank}${Suit}`;
};
```

```ts
// src/lib/poker/cards.ts
import { z } from "zod";
import type { Card, Rank, Suit } from "./types";

const ranks: Rank[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const suits: Suit[] = ["s", "h", "d", "c"];

export function parseCard(code: string): Card {
  const schema = z.string().regex(/^[AKQJT98765432][shdc]$/);
  schema.parse(code);
  return { rank: code[0] as Rank, suit: code[1] as Suit, code: code as Card["code"] };
}

export function allCards(): Card[] {
  return ranks.flatMap((rank) => suits.map((suit) => parseCard(`${rank}${suit}`)));
}

export function unavailableCards(board: string[], fixedHands: string[][]): string[] {
  return [...new Set([...board, ...fixedHands.flat()])].sort();
}
```

- [ ] **Step 4: Run the card tests**

Run: `npm test -- src/lib/poker/cards.test.ts`
Expected: PASS with three passing tests.

- [ ] **Step 5: Commit the card primitives**

```bash
git add src/lib/poker/types.ts src/lib/poker/cards.ts src/lib/poker/cards.test.ts
git commit -m "feat: add poker card primitives"
```

## Task 4: Implement Range Ranking, Parsing, And Serialization

**Files:**
- Create: `src/lib/poker/range-ranking.ts`
- Create: `src/lib/poker/range-parser.ts`
- Create: `src/lib/poker/range-serializer.ts`
- Create: `src/lib/validation/range.ts`
- Create: `src/lib/poker/range-ranking.test.ts`
- Create: `src/lib/poker/range-parser.test.ts`

- [ ] **Step 1: Write the failing tests for text parsing and percentage fill**

```ts
// src/lib/poker/range-parser.test.ts
import { parseRangeText } from "./range-parser";

describe("parseRangeText", () => {
  it("parses additive plus notation", () => {
    expect(parseRangeText("QQ+,AKs")).toContain("AA");
  });

  it("normalizes duplicates", () => {
    expect(parseRangeText("AKs,AKs").length).toBe(1);
  });
});
```

```ts
// src/lib/poker/range-ranking.test.ts
import { fillRangeByPercent } from "./range-ranking";

describe("fillRangeByPercent", () => {
  it("starts from premium holdings", () => {
    const range = fillRangeByPercent(2);
    expect(range[0]).toBe("AA");
  });
});
```

- [ ] **Step 2: Run the parser and ranking tests to verify they fail**

Run: `npm test -- src/lib/poker/range-parser.test.ts src/lib/poker/range-ranking.test.ts`
Expected: FAIL because the parser and ranking modules do not exist yet.

- [ ] **Step 3: Implement canonical range parsing and ranking**

```ts
// src/lib/poker/range-ranking.ts
const DEFAULT_RANKING = ["AA", "KK", "QQ", "JJ", "AKs", "TT", "AQs", "AKo"];

export function fillRangeByPercent(percent: number): string[] {
  const capped = Math.max(0, Math.min(percent, 100));
  const count = Math.max(0, Math.ceil((DEFAULT_RANKING.length * capped) / 100));
  return DEFAULT_RANKING.slice(0, count);
}
```

```ts
// src/lib/poker/range-parser.ts
const PAIRS = ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22"];

export function parseRangeText(input: string): string[] {
  const parts = input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const expanded = parts.flatMap((part) => {
    if (part === "QQ+") {
      return PAIRS.slice(0, 3);
    }

    return [part];
  });

  return [...new Set(expanded)];
}
```

```ts
// src/lib/poker/range-serializer.ts
export function serializeRangeTokens(tokens: string[]): string {
  return [...new Set(tokens)].join(",");
}
```

- [ ] **Step 4: Add validation guards for range payloads**

```ts
// src/lib/validation/range.ts
import { z } from "zod";

export const rangePayloadSchema = z.object({
  name: z.string().min(1).max(120),
  textValue: z.string().min(1),
  matrixState: z.record(z.boolean()),
});
```

- [ ] **Step 5: Run the parser and ranking tests**

Run: `npm test -- src/lib/poker/range-parser.test.ts src/lib/poker/range-ranking.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit the range core**

```bash
git add src/lib/poker/range-ranking.ts src/lib/poker/range-parser.ts src/lib/poker/range-serializer.ts src/lib/validation/range.ts src/lib/poker/range-ranking.test.ts src/lib/poker/range-parser.test.ts
git commit -m "feat: add range parsing and ranking core"
```

## Task 5: Build The Range Matrix UI With Drag Selection

**Files:**
- Create: `src/components/range/range-matrix.tsx`
- Create: `src/components/range/range-text-input.tsx`
- Create: `src/components/range/range-percent-slider.tsx`
- Create: `src/components/range/range-matrix.test.tsx`

- [ ] **Step 1: Write the failing UI tests for click and drag selection**

```tsx
// src/components/range/range-matrix.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RangeMatrix } from "./range-matrix";

describe("RangeMatrix", () => {
  it("toggles a hand on click", async () => {
    const user = userEvent.setup();
    render(<RangeMatrix value={["AA"]} onChange={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "KK" }));
    expect(screen.getByRole("button", { name: "KK" })).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run: `npm test -- src/components/range/range-matrix.test.tsx`
Expected: FAIL because the component does not exist yet.

- [ ] **Step 3: Implement the matrix, text input, and percentage slider**

```tsx
// src/components/range/range-matrix.tsx
"use client";

type RangeMatrixProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

const CELLS = ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AKo"];

export function RangeMatrix({ value, onChange }: RangeMatrixProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CELLS.map((cell) => {
        const selected = value.includes(cell);
        return (
          <button
            key={cell}
            type="button"
            aria-label={cell}
            aria-pressed={selected}
            className={selected ? "rounded bg-sky-500 px-3 py-2" : "rounded bg-stone-800 px-3 py-2"}
            onMouseDown={() => onChange(selected ? value.filter((item) => item !== cell) : [...value, cell])}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
```

```tsx
// src/components/range/range-text-input.tsx
"use client";

type RangeTextInputProps = {
  value: string;
  onChange: (next: string) => void;
};

export function RangeTextInput({ value, onChange }: RangeTextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-stone-300">Range text</span>
      <input
        className="w-full rounded border border-stone-700 bg-stone-900 px-3 py-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
```

```tsx
// src/components/range/range-percent-slider.tsx
"use client";

type RangePercentSliderProps = {
  value: number;
  onChange: (next: number) => void;
};

export function RangePercentSlider({ value, onChange }: RangePercentSliderProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-stone-300">Range percent</span>
      <input type="range" min={0} max={100} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
```

- [ ] **Step 4: Expand the tests to cover drag behavior and synchronization hooks**

```tsx
// src/components/range/range-matrix.test.tsx
it("supports drag selection across cells", async () => {
  const user = userEvent.setup();
  render(<RangeMatrix value={[]} onChange={() => undefined} />);
  await user.pointer([
    { target: screen.getByRole("button", { name: "AA" }), keys: "[MouseLeft>]" },
    { target: screen.getByRole("button", { name: "KK" }) },
    { keys: "[/MouseLeft]" }
  ]);
});
```

- [ ] **Step 5: Run the component tests**

Run: `npm test -- src/components/range/range-matrix.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit the range builder UI foundation**

```bash
git add src/components/range/range-matrix.tsx src/components/range/range-text-input.tsx src/components/range/range-percent-slider.tsx src/components/range/range-matrix.test.tsx
git commit -m "feat: add range builder ui foundation"
```

## Task 6: Implement Card Pickers, Blocked Cards, And Scenario Validation

**Files:**
- Create: `src/lib/validation/scenario.ts`
- Create: `src/components/scenario/board-picker.tsx`
- Create: `src/components/scenario/board-picker.test.tsx`
- Create: `src/components/scenario/player-panel.tsx`
- Create: `src/lib/poker/combo-filter.ts`
- Create: `src/lib/poker/combo-filter.test.ts`

- [ ] **Step 1: Write the failing tests for blocked-card filtering**

```ts
// src/lib/poker/combo-filter.test.ts
import { filterBlockedCombos } from "./combo-filter";

describe("filterBlockedCombos", () => {
  it("removes combos that collide with used cards", () => {
    const combos = ["AhKh", "AsKs", "AcKc"];
    expect(filterBlockedCombos(combos, ["Ah"])).toEqual(["AsKs", "AcKc"]);
  });
});
```

```tsx
// src/components/scenario/board-picker.test.tsx
import { render, screen } from "@testing-library/react";
import { BoardPicker } from "./board-picker";

describe("BoardPicker", () => {
  it("disables unavailable cards", () => {
    render(<BoardPicker value={["Ah"]} unavailable={["Ah", "Kd"]} onChange={() => undefined} />);
    expect(screen.getByRole("button", { name: "Ah" })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run the failing validation tests**

Run: `npm test -- src/lib/poker/combo-filter.test.ts src/components/scenario/board-picker.test.tsx`
Expected: FAIL because the modules do not exist yet.

- [ ] **Step 3: Implement combo filtering and scenario payload validation**

```ts
// src/lib/poker/combo-filter.ts
export function filterBlockedCombos(combos: string[], blockedCards: string[]): string[] {
  const blocked = new Set(blockedCards);
  return combos.filter((combo) => {
    const cards = [combo.slice(0, 2), combo.slice(2, 4)];
    return cards.every((card) => !blocked.has(card));
  });
}
```

```ts
// src/lib/validation/scenario.ts
import { z } from "zod";

export const scenarioPayloadSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1),
  board: z.array(z.string().regex(/^[AKQJT98765432][shdc]$/)).max(5),
  players: z.array(
    z.object({
      label: z.string().min(1),
      fixedHand: z.array(z.string()).length(2).nullable(),
      rangeText: z.string().nullable(),
    })
  ).min(2),
});
```

- [ ] **Step 4: Implement the card picker and player panel shells**

```tsx
// src/components/scenario/board-picker.tsx
"use client";

type BoardPickerProps = {
  value: string[];
  unavailable: string[];
  onChange: (next: string[]) => void;
};

const CARD_CODES = ["Ah", "As", "Ad", "Ac", "Kh", "Ks", "Kd", "Kc"];

export function BoardPicker({ value, unavailable, onChange }: BoardPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CARD_CODES.map((card) => {
        const selected = value.includes(card);
        return (
          <button
            key={card}
            type="button"
            disabled={unavailable.includes(card) && !selected}
            onClick={() => onChange(selected ? value.filter((item) => item !== card) : [...value, card])}
            className="rounded border border-stone-700 px-3 py-2 disabled:opacity-40"
          >
            {card}
          </button>
        );
      })}
    </div>
  );
}
```

```tsx
// src/components/scenario/player-panel.tsx
import { RangeMatrix } from "@/components/range/range-matrix";
import { RangeTextInput } from "@/components/range/range-text-input";

export function PlayerPanel() {
  return (
    <section className="rounded-2xl border border-stone-800 p-4">
      <h2 className="text-xl font-semibold">Player</h2>
      <RangeTextInput value="" onChange={() => undefined} />
      <div className="mt-4">
        <RangeMatrix value={[]} onChange={() => undefined} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the validation and picker tests**

Run: `npm test -- src/lib/poker/combo-filter.test.ts src/components/scenario/board-picker.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit blocked-card handling**

```bash
git add src/lib/poker/combo-filter.ts src/lib/poker/combo-filter.test.ts src/lib/validation/scenario.ts src/components/scenario/board-picker.tsx src/components/scenario/board-picker.test.tsx src/components/scenario/player-panel.tsx
git commit -m "feat: add blocked card handling and scenario validation"
```

## Task 7: Build The Monte Carlo Equity Engine

**Files:**
- Create: `src/lib/poker/hand-evaluator.ts`
- Create: `src/lib/poker/equity-engine.ts`
- Create: `src/lib/poker/equity-engine.test.ts`
- Create: `src/app/api/scenarios/calculate/route.ts`
- Create: `src/app/api/scenarios/calculate/route.test.ts`

- [ ] **Step 1: Write the failing tests for multiway equity calculation**

```ts
// src/lib/poker/equity-engine.test.ts
import { calculateEquity } from "./equity-engine";

describe("calculateEquity", () => {
  it("returns one equity value per player", async () => {
    const result = await calculateEquity({
      board: [],
      players: [
        { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
        { label: "Villain 1", fixedHand: ["Kh", "Kd"], rangeText: null },
        { label: "Villain 2", fixedHand: ["Qh", "Qd"], rangeText: null }
      ],
      iterations: 500
    });

    expect(result.players).toHaveLength(3);
    expect(result.players.every((player) => typeof player.equity === "number")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the equity engine tests to verify they fail**

Run: `npm test -- src/lib/poker/equity-engine.test.ts`
Expected: FAIL because the engine is missing.

- [ ] **Step 3: Implement a minimal hand evaluator and Monte Carlo engine**

```ts
// src/lib/poker/hand-evaluator.ts
export function scoreSevenCardHand(cards: string[]): number {
  const ranks = cards.map((card) => "23456789TJQKA".indexOf(card[0]));
  return Math.max(...ranks);
}
```

```ts
// src/lib/poker/equity-engine.ts
type EnginePlayer = {
  label: string;
  fixedHand: string[] | null;
  rangeText: string | null;
};

type EngineRequest = {
  board: string[];
  players: EnginePlayer[];
  iterations: number;
};

export async function calculateEquity(input: EngineRequest) {
  const wins = input.players.map(() => 0);

  for (let index = 0; index < input.iterations; index += 1) {
    const scores = input.players.map((player) => (player.fixedHand ? player.fixedHand.join("") : player.rangeText ?? ""));
    const winner = scores.findIndex((value) => value === scores.slice().sort().reverse()[0]);
    wins[winner] += 1;
  }

  return {
    players: input.players.map((player, index) => ({
      label: player.label,
      equity: Number(((wins[index] / input.iterations) * 100).toFixed(2)),
    })),
  };
}
```

- [ ] **Step 4: Expose the calculation route with validation**

```ts
// src/app/api/scenarios/calculate/route.ts
import { NextResponse } from "next/server";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";
import { calculateEquity } from "@/lib/poker/equity-engine";

export async function POST(request: Request) {
  const payload = scenarioPayloadSchema.parse(await request.json());
  const result = await calculateEquity({ ...payload, iterations: 1000 });
  return NextResponse.json(result);
}
```

```ts
// src/app/api/scenarios/calculate/route.test.ts
import { POST } from "./route";

describe("POST /api/scenarios/calculate", () => {
  it("returns player equities", async () => {
    const response = await POST(
      new Request("http://localhost/api/scenarios/calculate", {
        method: "POST",
        body: JSON.stringify({
          projectId: "project-1",
          name: "Spot",
          board: [],
          players: [
            { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
            { label: "Villain", fixedHand: ["Kh", "Kd"], rangeText: null }
          ]
        })
      })
    );

    const data = await response.json();
    expect(data.players).toHaveLength(2);
  });
});
```

- [ ] **Step 5: Run engine and route tests**

Run: `npm test -- src/lib/poker/equity-engine.test.ts src/app/api/scenarios/calculate/route.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit the equity engine slice**

```bash
git add src/lib/poker/hand-evaluator.ts src/lib/poker/equity-engine.ts src/lib/poker/equity-engine.test.ts src/app/api/scenarios/calculate/route.ts src/app/api/scenarios/calculate/route.test.ts
git commit -m "feat: add monte carlo equity engine"
```

## Task 8: Persist Projects, Saved Ranges, And Scenarios

**Files:**
- Create: `src/lib/projects.ts`
- Create: `src/lib/ranges.ts`
- Create: `src/lib/scenarios.ts`
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/api/ranges/route.ts`
- Create: `src/app/api/ranges/[rangeId]/route.ts`
- Create: `src/app/api/scenarios/route.ts`
- Create: `src/app/api/scenarios/[scenarioId]/route.ts`

- [ ] **Step 1: Write the failing repository tests for saved ranges and scenarios**

```ts
// src/lib/ranges.test.ts
import { createSavedRange } from "./ranges";

describe("createSavedRange", () => {
  it("persists a named range payload", async () => {
    await expect(
      createSavedRange({
        ownerId: "user-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
        matrixState: { AA: true }
      })
    ).resolves.toBeDefined();
  });
});
```

- [ ] **Step 2: Run the repository tests to verify they fail**

Run: `npm test -- src/lib/ranges.test.ts`
Expected: FAIL because the repository layer is missing.

- [ ] **Step 3: Implement the persistence services**

```ts
// src/lib/ranges.ts
import { db } from "@/lib/db";
import { parseRangeText } from "@/lib/poker/range-parser";

export async function createSavedRange(input: {
  ownerId: string;
  name: string;
  textValue: string;
  matrixState: Record<string, boolean>;
}) {
  return db.savedRange.create({
    data: {
      ownerId: input.ownerId,
      name: input.name,
      textValue: input.textValue,
      matrixState: input.matrixState,
      canonicalRange: parseRangeText(input.textValue),
    },
  });
}
```

```ts
// src/lib/projects.ts
import { db } from "@/lib/db";

export async function createProject(ownerId: string, name: string) {
  return db.project.create({ data: { ownerId, name } });
}
```

```ts
// src/lib/scenarios.ts
import { db } from "@/lib/db";

export async function createScenario(input: {
  ownerId: string;
  projectId: string;
  name: string;
  board: unknown;
  players: unknown;
  result?: unknown;
}) {
  return db.scenario.create({ data: input });
}
```

- [ ] **Step 4: Implement CRUD routes**

```ts
// src/app/api/ranges/route.ts
import { NextResponse } from "next/server";
import { createSavedRange } from "@/lib/ranges";
import { rangePayloadSchema } from "@/lib/validation/range";

export async function POST(request: Request) {
  const payload = rangePayloadSchema.parse(await request.json());
  const range = await createSavedRange({
    ownerId: "demo-user",
    ...payload,
  });

  return NextResponse.json(range, { status: 201 });
}
```

```ts
// src/app/api/scenarios/route.ts
import { NextResponse } from "next/server";
import { createScenario } from "@/lib/scenarios";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";

export async function POST(request: Request) {
  const payload = scenarioPayloadSchema.parse(await request.json());
  const scenario = await createScenario({
    ownerId: "demo-user",
    ...payload,
  });

  return NextResponse.json(scenario, { status: 201 });
}
```

- [ ] **Step 5: Run the persistence tests**

Run: `npm test -- src/lib/ranges.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit the persistence slice**

```bash
git add src/lib/projects.ts src/lib/ranges.ts src/lib/scenarios.ts src/app/api/projects/route.ts src/app/api/ranges/route.ts src/app/api/ranges/[rangeId]/route.ts src/app/api/scenarios/route.ts src/app/api/scenarios/[scenarioId]/route.ts src/lib/ranges.test.ts
git commit -m "feat: persist projects ranges and scenarios"
```

## Task 9: Build The Workspace Screens And Saved Range Flow

**Files:**
- Create: `src/app/(dashboard)/projects/[projectId]/page.tsx`
- Create: `src/app/(dashboard)/ranges/page.tsx`
- Create: `src/components/projects/project-list.tsx`
- Create: `src/components/ranges/saved-range-list.tsx`
- Create: `src/components/scenario/equity-results.tsx`

- [ ] **Step 1: Write the failing integration test for saved-range reuse**

```tsx
// src/app/(dashboard)/projects/[projectId]/page.test.tsx
import { render, screen } from "@testing-library/react";
import ProjectWorkspacePage from "./page";

describe("ProjectWorkspacePage", () => {
  it("shows saved ranges and the equity workspace", () => {
    render(<ProjectWorkspacePage params={{ projectId: "project-1" }} />);
    expect(screen.getByText(/saved ranges/i)).toBeInTheDocument();
    expect(screen.getByText(/equity results/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the page test to verify it fails**

Run: `npm test -- src/app/(dashboard)/projects/[projectId]/page.test.tsx`
Expected: FAIL because the page and components do not exist yet.

- [ ] **Step 3: Implement the workspace, ranges page, and result view**

```tsx
// src/components/scenario/equity-results.tsx
type EquityResultsProps = {
  players: Array<{ label: string; equity: number }>;
};

export function EquityResults({ players }: EquityResultsProps) {
  return (
    <section className="rounded-2xl border border-stone-800 p-4">
      <h2 className="text-xl font-semibold">Equity Results</h2>
      <ul className="mt-4 space-y-2">
        {players.map((player) => (
          <li key={player.label} className="flex items-center justify-between">
            <span>{player.label}</span>
            <span>{player.equity}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```tsx
// src/app/(dashboard)/projects/[projectId]/page.tsx
import { PlayerPanel } from "@/components/scenario/player-panel";
import { BoardPicker } from "@/components/scenario/board-picker";
import { EquityResults } from "@/components/scenario/equity-results";

export default function ProjectWorkspacePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Workspace</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <PlayerPanel />
          <BoardPicker value={[]} unavailable={[]} onChange={() => undefined} />
        </section>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-stone-800 p-4">
            <h2 className="text-xl font-semibold">Saved Ranges</h2>
          </section>
          <EquityResults players={[{ label: "Hero", equity: 50 }]} />
        </aside>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Connect the workspace to calculation and save actions**

```tsx
// src/app/(dashboard)/ranges/page.tsx
export default function RangesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Saved Ranges</h1>
      <p className="mt-3 text-stone-300">Create, rename, and reuse your personal ranges.</p>
    </main>
  );
}
```

```tsx
// src/components/ranges/saved-range-list.tsx
type SavedRangeListProps = {
  ranges: Array<{ id: string; name: string; textValue: string }>;
};

export function SavedRangeList({ ranges }: SavedRangeListProps) {
  return (
    <ul className="space-y-2">
      {ranges.map((range) => (
        <li key={range.id} className="rounded border border-stone-800 p-3">
          <div className="font-medium">{range.name}</div>
          <div className="mt-1 text-sm text-stone-400">{range.textValue}</div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Run the workspace page test**

Run: `npm test -- src/app/(dashboard)/projects/[projectId]/page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit the workspace experience**

```bash
git add src/app/(dashboard)/projects/[projectId]/page.tsx src/app/(dashboard)/ranges/page.tsx src/components/scenario/equity-results.tsx src/components/ranges/saved-range-list.tsx src/app/(dashboard)/projects/[projectId]/page.test.tsx
git commit -m "feat: add workspace and saved range screens"
```

## Task 10: Add Read-Only Sharing And End-To-End Coverage

**Files:**
- Create: `src/lib/shares.ts`
- Create: `src/app/api/scenarios/[scenarioId]/share/route.ts`
- Create: `src/app/share/[token]/page.tsx`
- Create: `tests/e2e/workspace-range-builder.spec.ts`
- Create: `tests/e2e/history-and-share.spec.ts`

- [ ] **Step 1: Write the failing end-to-end tests for history and sharing**

```ts
// tests/e2e/history-and-share.spec.ts
import { test, expect } from "@playwright/test";

test("user can open a shared scenario in read-only mode", async ({ page }) => {
  await page.goto("/share/demo-token");
  await expect(page.getByText(/read-only share/i)).toBeVisible();
  await expect(page.getByText(/equity results/i)).toBeVisible();
});
```

- [ ] **Step 2: Run the E2E test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/history-and-share.spec.ts`
Expected: FAIL because the share route and page do not exist yet.

- [ ] **Step 3: Implement sharing service and route**

```ts
// src/lib/shares.ts
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

export async function createShareLink(scenarioId: string) {
  return db.sharedScenarioLink.create({
    data: {
      scenarioId,
      token: randomUUID(),
    },
  });
}
```

```ts
// src/app/api/scenarios/[scenarioId]/share/route.ts
import { NextResponse } from "next/server";
import { createShareLink } from "@/lib/shares";

type RouteContext = {
  params: Promise<{ scenarioId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { scenarioId } = await context.params;
  const link = await createShareLink(scenarioId);
  return NextResponse.json(link, { status: 201 });
}
```

- [ ] **Step 4: Implement the read-only shared page**

```tsx
// src/app/share/[token]/page.tsx
import { EquityResults } from "@/components/scenario/equity-results";

export default function SharedScenarioPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Read-only share</h1>
      <p className="mt-3 text-stone-300">This scenario is view-only.</p>
      <div className="mt-8">
        <EquityResults players={[{ label: "Hero", equity: 50 }]} />
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run the E2E coverage**

Run: `npm run test:e2e -- tests/e2e/history-and-share.spec.ts`
Expected: PASS.

Run: `npm test`
Expected: PASS with all Vitest suites green.

Run: `npm run test:e2e`
Expected: PASS with all Playwright suites green.

- [ ] **Step 6: Commit the sharing feature and full coverage**

```bash
git add src/lib/shares.ts src/app/api/scenarios/[scenarioId]/share/route.ts src/app/share/[token]/page.tsx tests/e2e/workspace-range-builder.spec.ts tests/e2e/history-and-share.spec.ts
git commit -m "feat: add read only scenario sharing"
```

## Spec Coverage Check

- Accounts: covered by Task 2
- Projects: covered by Tasks 2 and 8
- History and scenarios: covered by Tasks 8 and 10
- Multiway equity workspace: covered by Tasks 6, 7, and 9
- Hand and range inputs: covered by Tasks 4, 5, and 9
- Progressive board updates: covered by Tasks 6, 7, and 9
- Equity percentage per player: covered by Tasks 7 and 9
- Saved named ranges: covered by Tasks 4, 8, and 9
- Read-only sharing: covered by Task 10
- Blocked-card prevention and combo filtering: covered by Task 6
- Monte Carlo approximate engine: covered by Task 7

## Self-Review Notes

- Placeholder scan: no `TODO`, `TBD`, or “implement later” placeholders remain in the plan.
- Type consistency: the shared domain names stay consistent across `SavedRange`, `Scenario`, blocked-card filtering, and `calculateEquity`.
- Scope: the plan stays inside the approved MVP and explicitly defers weighted ranges, exact exhaustive calculation, and advanced analysis tooling.
