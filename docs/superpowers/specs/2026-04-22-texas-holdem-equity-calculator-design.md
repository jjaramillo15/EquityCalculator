# Texas Hold'em Equity Calculator MVP Design

Date: 2026-04-22
Status: Draft approved in conversation, awaiting written spec review

## 1. Goal

Build a web app MVP for reviewing Texas Hold'em scenarios by calculating each player's equity from either fixed hands or hand ranges. The app must support multiway scenarios from the start, update results as board cards are added, and let users save reusable named ranges plus historical hand-review scenarios under their own account.

This MVP is intentionally focused on the core review workflow rather than advanced analysis. It should feel fast, practical, and reliable for repeated study sessions.

## 2. MVP Scope

The MVP includes:

- User accounts
- Personal projects for organizing reviews
- Calculation history per user
- A web-based equity workspace
- Support for 2 or more players
- Player input as either a fixed hand or a range
- Progressive board entry for flop, turn, and river
- Equity percentage per player
- Named saved ranges that can be reused in future calculations
- Read-only sharing for saved calculations
- A range builder with both matrix and text input
- Percentage-based range filling using a predefined ranking order

The MVP does not include:

- Weighted ranges such as `AA:50%`
- Manual combo weights in the UI
- Exact exhaustive calculation for all scenarios
- Omaha or other poker variants
- Collaborative editing
- Advanced reports, heatmaps, or range-vs-subrange analysis

## 3. Product Principles

- Prioritize speed of use for hand review
- Prevent invalid card selection before it happens
- Keep range editing visual and text-friendly
- Make saved ranges reusable across projects
- Keep the official equity calculation on the server for consistency and future mobile reuse
- Prefer a smaller, reliable core over a large but fragile first release

## 4. Primary Users And Jobs

### 4.1 Primary user

A poker player reviewing hands and wanting to estimate equity quickly against one or more opponents using fixed hands or realistic ranges.

### 4.2 Core jobs to be done

- Build a scenario with several players
- Assign a hand or range to each player
- Add board cards street by street
- See how equity changes as information increases
- Save the scenario for later review
- Reuse named ranges instead of rebuilding them each time
- Share a calculation as a read-only link when needed

## 5. Recommended Technical Direction

Use a web-first monolithic application with an integrated backend. The frontend provides the interactive workspace and account experience, while the backend owns persistence, authentication, and the equity engine. The equity engine should be implemented as an isolated internal module so it can later be reused behind a public API or mobile app backend without rewriting its core logic.

This structure is recommended because it keeps the MVP simple to build while preserving a clean path toward future expansion.

## 6. Core User Experience

### 6.1 Main areas of the product

The product is organized into three primary areas:

- Equity workspace: create and edit a scenario, assign hands or ranges, add board cards, and view current equity per player
- Range library: create, name, edit, duplicate, and reuse saved ranges
- Projects and history: group scenarios into projects and revisit prior calculations

### 6.2 Typical workflow

1. User signs in.
2. User opens a project or creates a new one.
3. User starts a new scenario.
4. User adds players.
5. For each player, user chooses either a fixed hand or a range.
6. User optionally uses a saved named range from their library.
7. User adds flop, turn, and river cards as needed.
8. The app recalculates equity after each relevant change.
9. User saves the scenario into project history.
10. User may share a read-only link to that saved scenario.

## 7. Range Builder Design

### 7.1 Inputs

The range builder must support both of these inputs from day one:

- A `13x13` visual matrix for Hold'em hand classes
- A text input that accepts notation such as `QQ+`, `AJs+`, `KQo`

These two inputs must stay synchronized in both directions:

- Matrix changes update the text representation
- Text edits update the matrix selection

### 7.2 Matrix interaction

The matrix is a primary editing surface, not a secondary convenience. It must support:

- Single click to select a hand class
- Single click to deselect a hand class
- Click-and-drag to paint across multiple cells
- Click-and-drag to remove multiple cells when drag starts from a deselection action

This interaction should feel immediate and stable because it will be one of the most common actions in the app.

### 7.3 Percentage-based fill

The range builder includes a percentage control from `0%` to `100%`. As the percentage increases, the app fills the range according to a predefined hand-ranking order, starting from premium holdings such as `AA` and moving downward until the requested coverage is reached.

For the MVP:

- Use a single built-in ranking profile
- Keep the behavior deterministic and easy to understand
- Do not yet support multiple ranking models or user-defined ranking systems

### 7.4 Saved ranges

Users can save a range with a custom name and later reuse it in new scenarios. The range library must support:

- Create
- Edit
- Duplicate
- Delete
- Insert saved range into a player's slot during scenario setup

Saved ranges are personal to the user in the MVP.

## 8. Scenario And Board Rules

### 8.1 Supported scenario shape

The MVP must support multiway scenarios from the start, not only heads-up. A scenario contains:

- Two or more players
- For each player: either a fixed hand or a range
- Optional flop
- Optional turn
- Optional river

### 8.2 Progressive board updates

The system recalculates equity whenever the scenario changes, especially when:

- A player's hand changes
- A player's range changes
- The flop is added or changed
- The turn is added or changed
- The river is added or changed

The user should be able to review the same hand as it evolves from preflop to river without rebuilding the scenario.

## 9. Invalid Card Prevention And Combo Filtering

### 9.1 Prevent invalid fixed-card selection

Any card already used by a fixed hand or by the board must become grayed out and unavailable in other card pickers. This prevents duplicate card selection before it happens.

### 9.2 Handle ranges with blocked combos

Ranges should not be disabled as a whole just because some of their combos conflict with already used cards. Instead, the engine must automatically remove invalid combos and keep only the combos still compatible with the known cards.

Examples:

- If `Ah` is already on the board, a range containing `AKs` still has valid suited ace-king combos except those requiring `Ah`
- If a player's fixed hand uses `Kc`, any conflicting combos in opponent ranges are silently excluded from the calculation

### 9.3 Invalid scenario state

If filtering leaves a player with zero valid combos, the scenario becomes invalid and the app must clearly communicate that the calculation cannot run until the input is adjusted.

The same applies to:

- Repeated cards on the board
- Incomplete fixed-card selections where a calculation requires more information than is currently present

The app should be forgiving in editing flow, but it must never present a misleading equity result.

## 10. Equity Calculation Strategy

### 10.1 Calculation mode

The MVP will use a fast approximate simulation approach rather than full exact enumeration. A Monte Carlo style simulation is acceptable because the product goal is practical review speed, not ultra-fine precision.

This means:

- Results should be close enough for study use
- Tiny differences such as very small decimal changes are not a priority
- The system should respond quickly as the user edits scenarios

### 10.2 Calculation responsibilities

The backend equity engine receives the scenario state, removes impossible combos based on known cards, runs the simulation, and returns equity percentage for each player.

For the MVP output, only this result is required:

- `equity %` per player

The MVP does not need to display:

- Separate win percentage
- Separate tie percentage
- Street-by-street graphing

## 11. Accounts, Projects, History, And Sharing

### 11.1 Accounts

Users need personal accounts so they can keep their own materials private by default.

### 11.2 Projects

Projects act as containers for groups of related calculations or hand reviews. A user can create multiple projects and store scenarios under them.

### 11.3 History

Each saved scenario becomes part of the user's history so they can reopen prior work without rebuilding it from scratch.

### 11.4 Sharing

The MVP includes read-only sharing of saved calculations. Shared links allow someone else to inspect a saved scenario and its equity results but not modify it.

The MVP does not include collaborative editing or shared project ownership.

## 12. System Components

The backend is divided into four main modules:

- Authentication and users
- Saved ranges
- Projects and scenario history
- Equity engine

The frontend is responsible for:

- Interactive scenario editing
- Range matrix and text synchronization
- Fixed-card selection UI with grayed-out invalid cards
- Calling backend endpoints for calculation and persistence
- Rendering saved histories and range library views

## 13. Data Model Outline

This MVP needs the following core entities:

- User
- Project
- Scenario
- ScenarioPlayer
- SavedRange
- SharedScenarioLink

At a conceptual level:

- A `User` owns many `Projects`
- A `Project` owns many `Scenarios`
- A `Scenario` stores board state plus player entries
- A `ScenarioPlayer` stores either a fixed hand or a range reference / inline range snapshot
- A `SavedRange` belongs to one user and stores both canonical internal form and display-friendly representations
- A `SharedScenarioLink` points to a saved scenario in read-only mode

## 14. API Behavior Outline

The product should expose API endpoints or equivalent server actions for:

- Sign up / sign in
- Create and manage projects
- Create, update, and fetch scenarios
- Run or rerun equity calculation for a scenario draft
- Create and manage saved ranges
- Generate read-only share links

The exact transport format can be decided during implementation planning, but the boundary between interactive UI and server-owned calculation should remain explicit.

## 15. Performance Expectations

The product should feel responsive during normal review use, even in multiway spots. The target is not instant perfection under every worst-case range combination, but a smooth enough experience that users are willing to iterate quickly on hands and boards.

Performance work should focus on:

- Efficient canonical range parsing
- Fast combo filtering against known cards
- Reasonable simulation counts for useful accuracy
- Avoiding unnecessary recalculations when the scenario has not materially changed

## 16. Testing Strategy

### 16.1 Parser and range normalization tests

Cover:

- Text notation parsing
- Matrix-to-text synchronization
- Text-to-matrix synchronization
- Canonical storage format for saved ranges
- Percentage-fill behavior against the chosen ranking order

### 16.2 Equity engine tests

Cover:

- Multiway calculations
- Fixed-hand versus range scenarios
- Range versus range scenarios
- Progressive board updates from preflop to river
- Removal of blocked combos caused by fixed cards and board cards
- Invalid scenarios where a player ends with zero valid combos

### 16.3 UI interaction tests

Cover:

- Click to select and deselect matrix cells
- Click-and-drag painting
- Grayed-out unavailable cards in card pickers
- Creating and reusing named saved ranges
- Saving and reopening scenarios from history
- Read-only shared scenario view

## 17. Release Boundaries

The MVP is considered successful if a user can:

- Create an account
- Create a project
- Build a multiway Hold'em scenario
- Use fixed hands or ranges for each player
- Edit ranges through matrix and text inputs
- Use percentage-based range fill
- Add board cards street by street
- See updated equity percentages per player
- Save the scenario to history
- Save and reuse named ranges
- Share a saved scenario in read-only mode

The MVP is not blocked on advanced solver-style features, weighted subranges, or exact exhaustive math.

## 18. Future Expansion After MVP

Expected next candidates after the MVP:

- Weighted ranges
- Multiple percentage ranking profiles
- Exact calculation mode for smaller scenarios
- Richer result breakdowns such as win and tie percentages
- Mobile app client reusing the same backend equity engine
- More advanced range analysis tools

## 19. Open Decisions Deferred Intentionally

These are intentionally left for implementation planning rather than product design:

- Exact framework and database choices
- Authentication provider details
- Deployment platform
- Simulation tuning values
- Exact route structure and API style
- Detailed visual design system

Those are implementation decisions, not open product questions. The MVP scope and expected behavior are already defined above.
