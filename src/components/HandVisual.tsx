import * as React from "react";
import {TileVisual} from "./TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {StateService} from '../services/StateService'

type HandState = {
    tiles: Tile[]
}

//todo add subscribe to StateChanged
export class HandVisual extends React.Component<any, HandState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            tiles: this.stateService.hand
        }
    }

    getHand() {
        return this.state.tiles.map(this.getTile)
    }

    getTile(tile: Tile) {
        return (
            <TileVisual tile={tile} isDiscard={false} />
        )
    }

    render() {
     return (
         <div className={'hand'}>
             {this.getHand()}
         </div>
     )
    }
}