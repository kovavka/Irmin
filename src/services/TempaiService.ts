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
    pair: number | undefined
    remainingTiles: number[]
}

interface HandStructure {
    manSuit?: number[]
    pinSuit?: number[]
    souSuit?: number[]
    honors?: number[]
}

interface HandWaitStructure {
    man?: SuitStructure
    pin?: SuitStructure
    sou?: SuitStructure
    honors?: SuitStructure
}

export class TempaiService {
    hasTempai(hand: string): boolean {
        let suits = this.getSuits(hand)

        if (this.isChiitoi(suits) || this.isKokushiMuso(suits, hand)) {
            return true
        }

        let manSuits = suits.manSuit && this.run([], this.getSimpleSuitStructure(suits.manSuit))
        let pinSuits = suits.pinSuit && this.run([], this.getSimpleSuitStructure(suits.pinSuit))
        let souSuits = suits.souSuit && this.run([], this.getSimpleSuitStructure(suits.souSuit))
        let honors = suits.honors && this.run([], this.getSimpleSuitStructure(suits.honors))

        let possibleManSuits = this.getPossibleStructures(manSuits)
        let possiblePinSuits = this.getPossibleStructures(pinSuits)
        let possibleSouSuits = this.getPossibleStructures(souSuits)
        let possibleHonors = this.getPossibleStructures(honors)

        if (
            !!suits.manSuit !== (possibleManSuits.length !== 0) ||
            !!suits.pinSuit !== (possiblePinSuits.length !== 0) ||
            !!suits.souSuit !== (possibleSouSuits.length !== 0) ||
            !!suits.honors !== (possibleHonors.length !== 0)
        ) {
            return false
        }

        let handWaitStructures: HandWaitStructure[] =
            this.processPossibleManSuits(possibleManSuits, possiblePinSuits, possibleSouSuits, possibleHonors)

        for (let handWaitStructure of handWaitStructures) {
            if (this.isReadyHand(handWaitStructure)) {
                return true
            }
        }

        console.log(handWaitStructures)
        return false
    }

    private processPossibleManSuits(
        possibleManSuits: SuitStructure[],
        possiblePinSuits: SuitStructure[],
        possibleSouSuits: SuitStructure[],
        possibleHonors: SuitStructure[]
    ) {
        if (!possibleManSuits.length) {
            return this.processPossiblePinSuits(undefined, possiblePinSuits, possibleSouSuits, possibleHonors)
        }

        let handPatterns: HandWaitStructure[] = []
        for (let manStructure of possibleManSuits) {
            handPatterns.push(...this.processPossiblePinSuits(manStructure, possiblePinSuits, possibleSouSuits, possibleHonors))
        }
        return handPatterns
    }

    private processPossiblePinSuits(
        manStructure: SuitStructure | undefined,
        possiblePinSuits: SuitStructure[],
        possibleSouSuits: SuitStructure[],
        possibleHonors: SuitStructure[]
    ) {
        if (!possiblePinSuits.length) {
            return this.processPossibleSouSuits(manStructure, undefined, possibleSouSuits, possibleHonors)
        }

        let handPatterns: HandWaitStructure[] = []
        for (let pinStructure of possiblePinSuits) {
            handPatterns.push(...this.processPossibleSouSuits(manStructure, pinStructure, possibleSouSuits, possibleHonors))
        }
        return handPatterns
    }

    private processPossibleSouSuits(
        manStructure: SuitStructure | undefined,
        pinStructure: SuitStructure | undefined,
        possibleSouSuits: SuitStructure[],
        possibleHonors: SuitStructure[]
    ) {
        if (!possibleSouSuits.length) {
            return this.processPossibleHonors(manStructure, pinStructure, undefined, possibleHonors)
        }

        let handPatterns: HandWaitStructure[] = []
        for (let souStructure of possibleSouSuits) {
            handPatterns.push(...this.processPossibleHonors(manStructure, pinStructure, souStructure, possibleHonors))
        }
        return handPatterns
    }

    private processPossibleHonors(
        manStructure: SuitStructure | undefined,
        pinStructure: SuitStructure | undefined,
        souStructure: SuitStructure | undefined,
        possibleHonors: SuitStructure[]
    ) {
        if (!possibleHonors.length) {
            return [
                <HandWaitStructure> {
                man:  manStructure,
                pin:  pinStructure,
                sou:  souStructure,
            }]
        }

        let handPatterns: HandWaitStructure[] = []
        for (let honorStructure of possibleHonors) {
            handPatterns.push(<HandWaitStructure> {
                man:  manStructure,
                pin:  pinStructure,
                sou:  souStructure,
                honors:  honorStructure,
            })
        }

        return handPatterns
    }

    private isReadyHand(hand: HandWaitStructure) {
        let pairsCount = 0
        let waits: WaitPattern[] = []
        if (hand.man) {
            if (hand.man.pair) {
                pairsCount++
            }
            waits.push(...hand.man.waitPatterns)
        }
        if (hand.pin) {
            if (hand.pin.pair) {
                pairsCount++
            }
            waits.push(...hand.pin.waitPatterns)
        }
        if (hand.sou) {
            if (hand.sou.pair) {
                pairsCount++
            }
            waits.push(...hand.sou.waitPatterns)
        }
        if (hand.honors) {
            if (hand.honors.pair) {
                pairsCount++
            }
            waits.push(...hand.honors.waitPatterns)
        }

        if (pairsCount > 1 || waits.length > 2 || waits.length === 0) {
            return false
        }

        if (
            pairsCount === 0 &&
            (waits.length === 1 && waits[0].type === WaitPatternType.TANKI ||
                waits.length === 2 && waits.every(pattern => pattern.type === WaitPatternType.SHANPON))
        ) {
            return true
        }

        if (
            pairsCount === 1 &&
            [WaitPatternType.KANCHAN, WaitPatternType.RYANMEN_PENCHAN].includes(waits[0].type)
        ) {
            return true
        }

        return false
    }

    private getPossibleStructures(structures: SuitStructure[] | undefined): SuitStructure[] {
        if (!structures || !structures.length) {
            return []
        }

        return structures.filter(structure => this.isPossibleWaitPatterns(structure.waitPatterns))
    }

    private isPossibleWaitPatterns(patterns: WaitPattern[]): boolean {
        if (!patterns.length) {
            return true
        }
        if (patterns.length > 2) {
            return false
        }
        if (
            patterns.length === 1 &&
            [WaitPatternType.TANKI, WaitPatternType.KANCHAN, WaitPatternType.RYANMEN_PENCHAN].includes(patterns[0].type)
        ) {
            return true
        }
        if (patterns.length === 2 && patterns.every(pattern => pattern.type === WaitPatternType.SHANPON)) {
            return true
        }
        return false
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
            pair: undefined,
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
            structure.pair = data.pair
            structure.waitPatterns = data.waitPatterns
            allVariations.push(structure)
        }
    }

    private getPairsAndWaitings(unusedTiles: number[], isHonors: boolean): {pair: number | undefined, waitPatterns: WaitPattern[]} {
        let allPairs = this.getPairs(unusedTiles)

        let availablePair: number | undefined
        let remainingTiles = unusedTiles.slice(0)

        //if wait pattern is shanpon or hand has too mush pairs or pair and other tiles -> there is no pair, it's waitings
        if (allPairs.length === 1) {
            availablePair = allPairs[0]
            let pairTile = allPairs[0]
            remainingTiles = this.nextTiles(remainingTiles, pairTile, pairTile)
        }
        if (!remainingTiles.length) {
            return {pair: availablePair, waitPatterns: []}
        }

        let waitPatterns: WaitPattern[] = []
        while(remainingTiles.length) {
            let waitPattern = this.getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
            waitPatterns.push(waitPattern)
            remainingTiles = this.nextTiles(remainingTiles, ...waitPattern.tiles)
        }

        //it's impossible hand contains pair and tanki wait
        if (waitPatterns.find(x => x.type === WaitPatternType.TANKI)) {
            availablePair = undefined
            waitPatterns = []
            remainingTiles = unusedTiles.slice(0)
            while(remainingTiles.length) {
                let waitPattern = this.getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
                waitPatterns.push(waitPattern)
                remainingTiles = this.nextTiles(remainingTiles, ...waitPattern.tiles)
            }
        }

        return {pair: availablePair, waitPatterns: waitPatterns}
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