import { PawnColor, PLAYER_COLORS, BoardPosition } from './GameTypes';

/**
 * Data-driven board layout, per the port plan's Phase 5 rendering
 * architecture: the renderer should be a pure function of GameState.pawns
 * looking positions up here, rather than per-color logic scattered through
 * component code.
 *
 * Grid coordinates below are the standard 15x15 Ludo board path (a
 * cross-shaped board, 52 shared squares in a loop + a 6-square home column
 * per color leading to the center). This is the conventional layout used by
 * most open-source Ludo implementations, not something derived from any
 * Unity asset (none exists - see GameTypes.ts). Treat these grid
 * coordinates as a starting point to verify once actual board art exists in
 * Cocos Creator (Phase 0/5) - swap PATH_GRID_COORDS/HOME_COLUMN_GRID_COORDS
 * if the final art doesn't match a plain 15x15 grid.
 */

export interface GridCoord {
    col: number;
    row: number;
}

/** The 52 shared path cells, in path order, starting at Red's entry square. */
export const PATH_GRID_COORDS: GridCoord[] = [
    { col: 1, row: 6 }, { col: 2, row: 6 }, { col: 3, row: 6 }, { col: 4, row: 6 }, { col: 5, row: 6 },
    { col: 6, row: 5 }, { col: 6, row: 4 }, { col: 6, row: 3 }, { col: 6, row: 2 }, { col: 6, row: 1 }, { col: 6, row: 0 },
    { col: 7, row: 0 },
    { col: 8, row: 0 }, { col: 8, row: 1 }, { col: 8, row: 2 }, { col: 8, row: 3 }, { col: 8, row: 4 }, { col: 8, row: 5 },
    { col: 9, row: 6 }, { col: 10, row: 6 }, { col: 11, row: 6 }, { col: 12, row: 6 }, { col: 13, row: 6 }, { col: 14, row: 6 },
    { col: 14, row: 7 },
    { col: 14, row: 8 }, { col: 13, row: 8 }, { col: 12, row: 8 }, { col: 11, row: 8 }, { col: 10, row: 8 }, { col: 9, row: 8 },
    { col: 8, row: 9 }, { col: 8, row: 10 }, { col: 8, row: 11 }, { col: 8, row: 12 }, { col: 8, row: 13 }, { col: 8, row: 14 },
    { col: 7, row: 14 },
    { col: 6, row: 14 }, { col: 6, row: 13 }, { col: 6, row: 12 }, { col: 6, row: 11 }, { col: 6, row: 10 }, { col: 6, row: 9 },
    { col: 5, row: 8 }, { col: 4, row: 8 }, { col: 3, row: 8 }, { col: 2, row: 8 }, { col: 1, row: 8 }, { col: 0, row: 8 },
    { col: 0, row: 7 },
    { col: 0, row: 6 },
];

/** Each color's home column, 6 cells leading from the path into the center, in travel order. */
const HOME_COLUMN_GRID_COORDS: Record<PawnColor, GridCoord[]> = {
    red: [{ col: 1, row: 7 }, { col: 2, row: 7 }, { col: 3, row: 7 }, { col: 4, row: 7 }, { col: 5, row: 7 }, { col: 6, row: 7 }],
    blue: [{ col: 7, row: 1 }, { col: 7, row: 2 }, { col: 7, row: 3 }, { col: 7, row: 4 }, { col: 7, row: 5 }, { col: 7, row: 6 }],
    yellow: [{ col: 13, row: 7 }, { col: 12, row: 7 }, { col: 11, row: 7 }, { col: 10, row: 7 }, { col: 9, row: 7 }, { col: 8, row: 7 }],
    green: [{ col: 7, row: 13 }, { col: 7, row: 12 }, { col: 7, row: 11 }, { col: 7, row: 10 }, { col: 7, row: 9 }, { col: 7, row: 8 }],
};

/** Each color's 4-pawn yard, arbitrary corner clustering - only used when a pawn's position is 'yard'. */
const YARD_GRID_COORDS: Record<PawnColor, GridCoord[]> = {
    red: [{ col: 1.5, row: 1.5 }, { col: 3, row: 1.5 }, { col: 1.5, row: 3 }, { col: 3, row: 3 }],
    blue: [{ col: 11.5, row: 1.5 }, { col: 13, row: 1.5 }, { col: 11.5, row: 3 }, { col: 13, row: 3 }],
    yellow: [{ col: 11.5, row: 11.5 }, { col: 13, row: 11.5 }, { col: 11.5, row: 13 }, { col: 13, row: 13 }],
    green: [{ col: 1.5, row: 11.5 }, { col: 3, row: 11.5 }, { col: 1.5, row: 13 }, { col: 3, row: 13 }],
};

const CENTER_GRID_COORD: GridCoord = { col: 7, row: 7 };

/** Each color's absolute path index (0-51) that its own relative step 0 maps to. */
export const START_OFFSET: Record<PawnColor, number> = {
    red: 0,
    blue: 13,
    yellow: 26,
    green: 39,
};

/** Absolute path indices that are safe - no capture may happen there. Each color's start square plus the star square 8 ahead of it. */
export const SAFE_ABSOLUTE_INDICES: ReadonlySet<number> = new Set(
    PLAYER_COLORS.flatMap((color) => [START_OFFSET[color], (START_OFFSET[color] + 8) % 52])
);

export function absolutePathIndex(color: PawnColor, relativeStep: number): number {
    return (START_OFFSET[color] + relativeStep) % 52;
}

export function isSafeAbsoluteIndex(absoluteIndex: number): boolean {
    return SAFE_ABSOLUTE_INDICES.has(absoluteIndex);
}

export function gridCoordFor(color: PawnColor, pawnIndex: number, position: BoardPosition): GridCoord {
    switch (position.lane) {
        case 'yard':
            return YARD_GRID_COORDS[color][pawnIndex];
        case 'path':
            return PATH_GRID_COORDS[absolutePathIndex(color, position.step)];
        case 'home':
            return HOME_COLUMN_GRID_COORDS[color][position.step];
        case 'finished':
            return CENTER_GRID_COORD;
    }
}
