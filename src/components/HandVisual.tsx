import * as React from "react";
import {TileVisual} from "./TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {StateService} from '../services/StateService'
import {ScreenType} from '../types/ScreenType'

type HandState = {
    tiles: Tile[]
    tsumo: Tile | undefined
}

type HandProps = {
    selectable: boolean
    reverse: boolean
    hiddenTiles: boolean
}

export class HandVisual extends React.Component<HandProps, HandState> {
    stateService: StateService = StateService.instance

    constructor(props: HandProps) {
        super(props)

        this.state = {
            tiles: this.props.reverse ? this.stateService.hand.reverse() : this.stateService.hand,
            tsumo: this.stateService.tsumo,
        }
    }

    componentDidMount(): void {
        this.stateService.onHandChanged.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        this.stateService.onHandChanged.remove(this.updateState, this)
    }

    updateState() {
        this.setState({
            tiles: this.props.reverse ? this.stateService.hand.reverse() : this.stateService.hand,
            tsumo: this.stateService.tsumo
        })
    }

    getHand() {
        return this.state.tiles.map(this.getTile.bind(this))
    }

    getTile(tile: Tile) {
        return (
            <TileVisual tile={tile} isTsumo={false} isDiscard={false} selectable={this.props.selectable} hidden={this.props.hiddenTiles}/>
        )
    }

    getClassName() {
        let names = 'hand'

        if (this.props.selectable) {
            names += ' hand--selectable'
        }
        if (this.state.tsumo) {
            names += ' hand--with-tsumo'
        }

        return names
    }

    render() {
     return (
         <div className={this.getClassName()}>
            {this.state.tsumo && (
                <TileVisual tile={this.state.tsumo} isTsumo={true} isDiscard={false} selectable={this.props.selectable} hidden={false}/>
            )}
             {this.getHand()}
         </div>
     )
    }
}