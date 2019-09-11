//todo add DI

enum WaitPatternType {
    TANKI,
    SHANPON,
    KANCHAN,
    RYANMEN_PENCHAN,
}

interface WaitPattern {
    tiles: number[]
    type: WaitPatternType
}

interface SuitStructure {
    sets: number[][]
    unusedTiles: number[]
    waitPatterns: WaitPattern[]
    pairs: number[]
    remainingTiles: number[]
}

interface HandStructure {
    manSuit?: number[]
    pinSuit?: number[]
    souSuit?: number[]
    honors?: number[]
}

interface HandWaitPatterns {
    manSuit?: SuitStructure[]
    pinSuit?: SuitStructure[]
    souSuit?: SuitStructure[]
    honors?: SuitStructure[]
}

export class TempaiService {
    find(hand: string): boolean {
        let suits = this.getSuits(hand)

        if (this.isChiitoi(suits) || this.isKokushiMuso(suits, hand)) {
            return true
        }

        let handPattern: HandWaitPatterns = {}

        if (suits.manSuit) {
            handPattern.manSuit = this.run([], this.getSimpleSuitStructure(suits.manSuit))
        }
        if (suits.pinSuit) {
            handPattern.pinSuit = this.run([], this.getSimpleSuitStructure(suits.pinSuit))
        }
        if (suits.souSuit) {
            handPattern.souSuit = this.run([], this.getSimpleSuitStructure(suits.souSuit))
        }
        if (suits.honors) {
            handPattern.honors = this.run([], this.getSimpleSuitStructure(suits.honors), true)
        }

        console.log(handPattern)
        return  true
    }

    //OrSimpleTankiRyanpeikou
    private isChiitoi(suits: HandStructure) {
        let uniqueFilter = (v: number, i: number, a: number[]) => a.indexOf(v) === i
        let manPairs = suits.manSuit ? this.getPairs(suits.manSuit).filter(uniqueFilter) : []
        let pinPairs = suits.pinSuit ? this.getPairs(suits.pinSuit).filter(uniqueFilter) : []
        let souPairs = suits.souSuit ? this.getPairs(suits.souSuit).filter(uniqueFilter) : []
        let honorPairs = suits.honors ? this.getPairs(suits.honors).filter(uniqueFilter) : []

        let allUniquePairsCount = manPairs.length + pinPairs.length + souPairs.length + honorPairs.length
        return allUniquePairsCount === 6
    }

    private isKokushiMuso(suits: HandStructure, hand: string) {
        let terminalsHonorsRegex = new RegExp('^[1,9]{1,3}m[1,9]{1,3}p[1,9]{1,3}s[1-7]{6,8}z$')

        if (hand.length !== 17 || !terminalsHonorsRegex.test(hand)) {
            return false
        }

        let manTiles = suits.manSuit!
        let pinTiles = suits.pinSuit!
        let souTiles = suits.souSuit!
        let honorTiles = suits.honors!

        let manPairs = this.getPairs(manTiles)
        let pinPairs = this.getPairs(pinTiles)
        let souPairs = this.getPairs(souTiles)
        let honorPairs = this.getPairs(honorTiles)

        let allPairs = [...manPairs, ...pinPairs, ...souPairs, ...honorPairs]

        if (allPairs.length > 1) {
            return false
        }

        //13 way wait
        if (!allPairs.length) {
            let simpleWaitRegex = new RegExp('^19m19p19s1234567z$')
            return simpleWaitRegex.test(hand)
        }

        let remainingManSuit = manPairs.length ? manTiles.join('').replace(manPairs[0].toString(), '') : manTiles.join('')
        let remainingPinSuit = pinPairs.length ? pinTiles.join('').replace(pinPairs[0].toString(), '') : pinTiles.join('')
        let remainingSouSuit = souPairs.length ? souTiles.join('').replace(souPairs[0].toString(), '') : souTiles.join('')
        let remainingHonors = honorPairs.length ? honorTiles.join('').replace(honorPairs[0].toString(), '') : honorTiles.join('')

        let remainingHand = `${remainingManSuit}m${remainingPinSuit}p${remainingSouSuit}s${remainingHonors}z`

        let regex = new RegExp('^([19]m[19]{2}p[19]{2}s[1-7]{7}z|[19]{2}m[19]p[19]{2}s[1-7]{7}z|[19]{2}m[19]{2}p[19]s[1-7]{7}z|[19]{2}m[19]{2}p[19]{2}s[1-7]{6}z)$')
        return regex.test(remainingHand)
    }

    //check isHonors for getWaitPatterns!

    private getSuits(hand: string): HandStructure {
        let regex = new RegExp('^(([1-9]*)m)?(([1-9]*)p)?(([1-9]*)s)?(([1-7]*)z)?$')
        let matches = hand.match(regex)
        if (!matches)
            throw new Error('incorrect hand structure')

        let manTiles = matches[2] ? matches[2].split('').map(x => Number(x)) : undefined
        let pinTiles = matches[4] ? matches[4].split('').map(x => Number(x)) : undefined
        let souTiles = matches[6] ? matches[6].split('').map(x => Number(x)) : undefined
        let honorTiles = matches[8] ? matches[8].split('').map(x => Number(x)) : undefined

        return <HandStructure> {
            manSuit: manTiles,
            pinSuit: pinTiles,
            souSuit: souTiles,
            honors: honorTiles,
        }
    }

    private getSimpleSuitStructure(tiles: number[]): SuitStructure {
        return <SuitStructure> {
            sets: [],
            unusedTiles: [],
            waitPatterns: [],
            pairs: [],
            remainingTiles: tiles,
        }
    }

    private run(allVariations: SuitStructure[], structure: SuitStructure, isHonors: boolean = false): SuitStructure[] {
        if (structure.remainingTiles.length < 3) {
            structure.unusedTiles = structure.unusedTiles.concat(structure.remainingTiles)
            structure.remainingTiles = []
            // return [structure]
            this.trySetStructure(allVariations, structure, isHonors)
            return allVariations
        }

        let unusedTiles = structure.unusedTiles.slice(0)
        let remainingHand = structure.remainingTiles.slice(0)

        // let childStructures: HandStructure[] = []
        for (let tile of structure.remainingTiles) {
            let sets = this.getSets(tile, remainingHand)
            for(let set of sets) {
                let newStructure = <SuitStructure> {
                    sets: structure.sets.length ? structure.sets.concat([set]) : [set],
                    remainingTiles: this.nextTiles(remainingHand, ...set),
                    unusedTiles: unusedTiles.slice(0)
                }
                this.run(allVariations, newStructure, isHonors)

            }
            unusedTiles.push(tile)
            remainingHand = this.nextTiles(remainingHand, tile)
        }

        let parentStructure =  <SuitStructure> {
            sets: structure.sets,
            remainingTiles: remainingHand,
            unusedTiles: unusedTiles
        }
        this.trySetStructure(allVariations, parentStructure, isHonors)

        return allVariations
    }

    private trySetStructure(allVariations: SuitStructure[], structure: SuitStructure, isHonors: boolean) {
        let possibleStructures = allVariations.filter(x => x.sets.length === structure.sets.length &&
            x.unusedTiles.join('') === structure.unusedTiles.join('') &&
            x.sets.map(n => n.join('')).join(' ') === structure.sets.map(n => n.join('')).join(' '))

        if (!possibleStructures.length) {
            let data = this.getPairsAndWaitings(structure.unusedTiles, isHonors)
            structure.pairs = data.pairs
            structure.waitPatterns = data.waitPatterns
            allVariations.push(structure)
        }
    }

    private getPairsAndWaitings(unusedTiles: number[], isHonors: boolean): {pairs: number[], waitPatterns: WaitPattern[]} {
        let allPairs = this.getPairs(unusedTiles)

        let availablePairs: number[] = []
        let waitPatterns: WaitPattern[] = []
        let remainingTiles = unusedTiles.slice(0)

        //there is no pair if wait pattern is shanpon or hand has too mush pairs -> it's waitings
        if (allPairs.length === 1) {
            availablePairs = allPairs
            let pairTiles = allPairs[0]
            remainingTiles = this.nextTiles(remainingTiles, pairTiles, pairTiles)
        }
        if (!remainingTiles.length) {
            return {pairs: availablePairs, waitPatterns: waitPatterns}
        }

        while(remainingTiles.length) {
            let waitPattern = this.getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
            waitPatterns.push(waitPattern)
            remainingTiles = this.nextTiles(remainingTiles, ...waitPattern.tiles)
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

    private getWaitPatternFrom(tile: number, handPart: number[], isHonors: boolean): WaitPattern {
        if (this.includesFrom(handPart, tile, tile)) {
           return <WaitPattern> {
               tiles: [tile, tile],
               type: WaitPatternType.SHANPON,
           }
        }

        if (tile === 9 || isHonors) {
            //not shanpon => only tanki
            return <WaitPattern> {
                tiles: [tile],
                type: WaitPatternType.TANKI,
            }
        }

        let next1 = tile + 1
        if (this.includesFrom(handPart, tile, next1)) {
            //ryanmen or penchan
            return <WaitPattern> {
                tiles: [tile, next1],
                type: WaitPatternType.RYANMEN_PENCHAN,
            }
        }

        if (tile === 8) {
            //not shanpon, ryanmen or penchan => only tanki
            return <WaitPattern> {
                tiles: [tile],
                type: WaitPatternType.TANKI,
            }
        }

        let next2 = tile + 2
        if (this.includesFrom(handPart, tile, next2)) {
            //kanchan
            return <WaitPattern> {
                tiles: [tile, next2],
                type: WaitPatternType.KANCHAN,
            }
        }

        //only tanki
        return <WaitPattern> {
            tiles: [tile],
            type: WaitPatternType.TANKI,
        }
    }
}