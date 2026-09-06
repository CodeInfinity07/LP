import { GameState, PawnState, PlayerState, PawnColor } from './GameTypes';

export function createInitialGameState(matchId: string, players: Array<{ seat: number; userId: string; color: PawnColor; isBot?: boolean }>): GameState {
    const playerStates: PlayerState[] = players.map((p) => ({ seat: p.seat, userId: p.userId, color: p.color, isBot: p.isBot }));

    const pawns: PawnState[] = [];
    for (const player of playerStates) {
        for (let pawnIndex = 0; pawnIndex < 4; pawnIndex++) {
            pawns.push({ playerSeat: player.seat, pawnIndex: pawnIndex as 0 | 1 | 2 | 3, position: { lane: 'yard' } });
        }
    }

    const firstSeat = playerStates[0]?.seat ?? 0;

    return {
        matchId,
        players: playerStates,
        pawns,
        turn: { currentPlayerSeat: firstSeat, diceValue: null, phase: 'awaiting_roll', movablePawns: [] },
        winnerSeat: null,
    };
}
