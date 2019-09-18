import * as React from "react";
import {Tile} from "../types/Tile";
import {TileService} from "../services/TileService";
import discard from '../img/tile-discard.svg'
import hand from '../img/tile-hand.svg'
import './tile.css';
import {StateService} from '../services/StateService'

type TileDrawingProps = {
    tile: Tile,
    isDiscard: boolean,
    selectable: boolean,
}

export class TileVisual extends React.Component<TileDrawingProps> {
    stateService: StateService = StateService.instance

    constructor(props: TileDrawingProps) {
        super(props);
    }

    onTileSelected() {
        if (this.props.selectable && !this.props.isDiscard) {
            this.stateService.dropTile(this.props.tile)
        }
    }

    render() {
     return (
         <div className={'tile'} onClick={() => this.onTileSelected()}>
             <div className={'tile__inner' + (this.props.isDiscard ? ' tile__inner--discard' : '')}>
                 {this.props.isDiscard && (
                     <img className={'tile__box tile__box--discard'} src={discard}/>
                 )}
                 {!this.props.isDiscard && (
                     <img className={'tile__box tile__box--hand'} src={hand}/>
                 )}

                 <img className={'tile__drawing' + (this.props.isDiscard ? ' tile__drawing--discard' : ' tile__drawing--hand')}
                      src={TileService.getSvg(this.props.tile)}/>
             </div>
         </div>
     )
    }
}