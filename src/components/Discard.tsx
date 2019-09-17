import * as React from "react";
import {TileDrawing} from "./TileDrawing";
import {Tile} from "../models/Tile";
import discard from '../img/tile-discard.svg';

type DiscardState = {
    tiles: Tile[]
}

//todo add subscribe to StateChanged
export class Discard extends React.Component<DiscardState> {

    constructor(props: DiscardState) {
        super(props)
    }

    getDiscard() {
        let lines = [
                this.props.tiles.slice(0,6),
                this.props.tiles.slice(6,12),
                this.props.tiles.slice(12,18),
            ]
        return lines.map(line => {
            return (
                <div className={'discard__line'}>
                    {line.map(this.getTile)}
                </div>
            )
        })
    }


    getTile(tile: Tile) {
        return (
            <div className={'tile'}>
                <div className={'tile__inner'}>
                    <img className={'tile__box'} src={discard}/>
                    <TileDrawing tile={tile} isDiscard={true} />
                </div>
            </div>
        )
    }

    render() {
     return (
         <div className={'discard'}>
             {this.getDiscard()}
         </div>
     )
    }
}