export interface Tile {
    suit: SuitType
    value: number
}

export enum SuitType {
    MANZU,
    PINZU,
    SOUZU,
    JIHAI
}