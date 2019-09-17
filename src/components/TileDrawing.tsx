import * as React from "react";
import {Tile} from "../models/Tile";
import {TileService} from "../utils/TileService";

type TileDrawingState = {
    tile: Tile,
    isDiscard: boolean,
}

export class TileDrawing extends React.Component<TileDrawingState> {
    constructor(props: TileDrawingState) {
        super(props);
    }

    render() {
     return (
         <img className={'tile__drawing' + (this.props.isDiscard ? ' tile__drawing--discard' : '')} src={TileService.getSvg(this.props.tile)}/>
     )
    }
}