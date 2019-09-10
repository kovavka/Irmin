//todo add DI

interface SuitStructure {
    sets: number[][]
    unusedTiles: number[]
    waitPatterns: number[][]
    pairs: number[]
    remainingHand: number[]
}

interface HandStructure {
    manSuit: number[]
    pinSuit: number[]
    souSuit: number[]
    honors: number[]
}



export class TempaiService {

// 14445677
// 1 4445677
//
    find(hand: string) {
        let structure = <SuitStructure> {
            sets: [],
            unusedTiles: [],
            waitPatterns: [],
            pairs: [],
            remainingHand: hand.split('').map(x => Number(x)),
        }

        return this.run([], structure)
    }

    //isRyanpeikou
    //isKokushiMuso
    //check isHonors for getWaitPatterns!

    /*private isChiitoi(hand: string) {
        let suits = this.getSuits()
        let t = this.getPairs()
    }*/

    private getSuits(hand: string): HandStructure {
        let regex = new RegExp('^(([1-9]*)m)?(([1-9]*)p)?(([1-9]*)s)?(([1-7]*)z)?$')
        let matches = hand.match(regex)
        if (!matches)
            throw new Error('incorrect hand structure')

        let manSuit = matches[2].split('').map(x => Number(x))
        let pinSuit = matches[4].split('').map(x => Number(x))
        let souSuit = matches[6].split('').map(x => Number(x))
        let honors = matches[8].split('').map(x => Number(x))

        return <HandStructure> {
            manSuit: manSuit,
            pinSuit: pinSuit,
            souSuit: souSuit,
            honors: honors,
        }
    }

    private run(allVariations: SuitStructure[], structure: SuitStructure) {
        if (structure.remainingHand.length < 3) {
            structure.unusedTiles = structure.unusedTiles.concat(structure.remainingHand)
            structure.remainingHand = []
            // return [structure]
            this.trySetStructure(allVariations, structure)
            return allVariations
        }

        let unusedTiles = structure.unusedTiles.slice(0)
        let remainingHand = structure.remainingHand.slice(0)

        // let childStructures: HandStructure[] = []
        for (let tile of structure.remainingHand) {
            let sets = this.getSets(tile, remainingHand)
            for(let set of sets) {
                let newStructure = <SuitStructure> {
                    sets: structure.sets.length ? structure.sets.concat([set]) : [set],
                    remainingHand: this.nextTiles(remainingHand, ...set),
                    unusedTiles: unusedTiles.slice(0)
                }
                this.run(allVariations, newStructure)

            }
            unusedTiles.push(tile)
            remainingHand = this.nextTiles(remainingHand, tile)
        }

        let parentStructure =  <SuitStructure> {
            sets: structure.sets,
            remainingHand: remainingHand,
            unusedTiles: unusedTiles
        }
        this.trySetStructure(allVariations, parentStructure)

        return allVariations
    }

    private trySetStructure(allVariations: SuitStructure[], structure: SuitStructure) {
        let possibleStructures = allVariations.filter(x => x.sets.length === structure.sets.length &&
            x.unusedTiles.join('') === structure.unusedTiles.join('') &&
            x.sets.map(n => n.join('')).join(' ') === structure.sets.map(n => n.join('')).join(' '))

        if (!possibleStructures.length) {
            let data = this.getPairsAndWaitings(structure.unusedTiles)
            structure.pairs = data.pairs
            structure.waitPatterns = data.waitPatterns
            allVariations.push(structure)
        }
    }

    private getPairsAndWaitings(unusedTiles: number[]): {pairs: number[], waitPatterns: number[][]} {
        let allPairs = this.getPairs(unusedTiles)

        let availablePairs: number[] = []
        let waitPatterns: number[][] = []
        let remainingTails = unusedTiles.slice(0)

        //there is no pair if wait pattern is shanpon or hand has too mush pairs -> it's waitings
        if (allPairs.length === 1) {
            availablePairs = allPairs
            let pairTail = allPairs[0]
            remainingTails = this.nextTiles(remainingTails, pairTail, pairTail)
        }
        if (!remainingTails.length) {
            return {pairs: availablePairs, waitPatterns: waitPatterns}
        }

        while(remainingTails.length) {
            let waitPattern = this.getWaitPatternFrom(remainingTails[0], remainingTails)
            waitPatterns.push(waitPattern)
            remainingTails = this.nextTiles(remainingTails, ...waitPattern)
        }

        return {pairs: availablePairs, waitPatterns: waitPatterns}
    }

    private nextTiles(hand: number[], ...tiles: number[]): number[] {
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


    private getPairs(handPart: number[]): number[] {
        let unique = handPart.filter((x, i, a) => a.indexOf(x) == i)
        let pairs: number[] = []
        for (let tile of unique) {
            if (this.includesFrom(handPart, tile, tile)) {
                pairs.push(tile)
            }
        }

        return pairs
    }

    private getChii(tile: number, handPart: number[]): number[] | undefined {
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

    private getPon(tile: number, handPart: number[]): number[] | undefined  {
        if (this.includesFrom(handPart, tile, tile, tile)) {
            return [tile, tile, tile]
        }
        return undefined
    }

    //maybe return [][] with all wait patterns?
    private getWaitPatternFrom(tile: number, handPart: number[]): number[] {
        if (this.includesFrom(handPart, tile, tile)) {
            //shanpon
           return [tile, tile]
        }

        if (tile === 9) {
            //not shanpon => only tanki
            return [tile]
        }

        let next1 = tile + 1
        if (this.includesFrom(handPart, tile, next1)) {
            return [tile, next1] //ryanmen or penchan
        }

        if (tile === 8) {
            //not shanpon, ryanmen or penchan => only tanki
            return [tile]
        }

        let next2 = tile + 2
        if (this.includesFrom(handPart, tile, next2)) {
            return [tile, next2] //kanchan
        }

        //only tanki
        return [tile]
    }
}