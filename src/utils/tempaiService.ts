//todo add DI

interface HandStructure {
    sets: number[][]
    unusedTiles: number[]
    remainingHand: number[]
}


export class TempaiService {

// 14445677
// 1 4445677
//
    do() {
        while (true) {

            console.log()
        }
    }

    find(hand: string) {
        let structure = <HandStructure> {
            sets: [],
            remainingHand: hand.split('').map(x => Number(x)),
            unusedTiles: []
        }
        return this.run([], structure)
    }


    tyuio(hand: string) {
        //оставляем тайлы в начале как возможные пара + ожидание, то есть не больше 4-х и пытаемся найти сеты начиная с одного из них

        //clear isolated tiles
        for (let tile of hand.slice(0, 4)) {
            this.dffdf(Number(tile), hand)
            hand = hand.slice(1)

        }
    }

    dffdf(tile: number, str: string, hands: HandStructure[] = []) {

    }

    private run(allVariations: HandStructure[], structure: HandStructure) {
        if (structure.remainingHand.length < 3) {
            structure.sets.concat(structure.remainingHand)
            structure.remainingHand = []
            allVariations.push(structure)
        }

        let unusedTiles = structure.unusedTiles.slice(0)
        for (let tile of structure.remainingHand) {
            let sets = this.getSets(tile, structure.remainingHand)
            for(let set of sets) {
                let newStructure = <HandStructure> {
                    sets: structure.sets.concat(set),
                    remainingHand: this.nextTiles(structure.remainingHand, set),
                    unusedTiles: unusedTiles.slice(0)
                }
                this.run(allVariations, newStructure)

            }
            unusedTiles.push(tile)
        }

        return allVariations
    }

    private nextTiles(hand: number[], tiles: number[]): number[] {
        let str = hand.join('')
        for (let tile of tiles) {
            str = str.replace(tile.toString(), '')
        }
        return str.split('').map(x => Number(x))
    }

    private getSets(tile: number, str: number[]) {
        let sets = []
        let chii = this.getChii(tile, str)
        if (chii) {
            sets.push(chii)
        }

        let pon = this.getPon(tile, str)
        if (pon) {
            sets.push(pon)
        }
        return sets
    }



    private includesFrom(handPart: number[], ...tiles: number[]) {
        let str = handPart.join('')
        for (let tile of tiles) {
            if (!str.includes(tile.toString())) {
                return false
            }

            str = str.replace(tile.toString(), '')
        }
        return true
    }


    private hasPair(tile: number, str: string) {
        return str.includes(tile.toString())
    }

    private getChii(tile: number, handPart: number[]) {
        if (tile >= 8) {
            return undefined
        }

        let next1 = tile + 1
        let next2 = tile + 2
        if (this.includesFrom(handPart, tile, next1, next2)) {
            return [tile, next1, next2]
        }

        return undefined
    }

    private getPon(tile: number, handPart: number[]) {
        if (this.includesFrom(handPart, tile, tile, tile)) {
            return [tile, tile, tile]
        }
        return undefined
    }

    private getWaitings(tile: number, handPart: number[]) {
        let waitings = [[tile]] //tanki

        if (this.includesFrom(handPart, tile, tile)) {
            //shanpon
            waitings.push([tile, tile])
        }

        if (tile == 9) {
            return waitings
        }

        let next1 = tile + 1
        if (this.includesFrom(handPart, tile, next1)) {
            waitings.push([tile, next1]) //ryanmen или penchan
        }

        if (tile == 8) {
            return waitings
        }

        let next2 = tile + 2
        if (this.includesFrom(handPart, tile, next2)) {
            waitings.push([tile, next2]) //kanchan
        }

        return waitings
    }
}