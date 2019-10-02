export interface Tile {
    suit: SuitType
    value: number
}

export interface DiscardTile {
    suit: SuitType
    value: number
    tsumogiri: boolean
}

export enum SuitType {
    MANZU,
    PINZU,
    SOUZU,
    JIHAI
}