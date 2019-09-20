import * as React from "react";
import {Tile} from "../types/Tile";
import {TileService} from "../services/TileService";
import discardTile from '../img/tile-discard.svg'
import handTile from '../img/tile-hand.svg'
import hiddenTile from '../img/tile-hidden.svg'
import './tile.less';
import {StateService} from '../services/StateService'

type TileDrawingProps = {
    tile: Tile,
    isTsumo: boolean,
    isDiscard: boolean,
    selectable: boolean,
    hidden: boolean,
}

export class TileVisual extends React.Component<TileDrawingProps> {
    stateService: StateService = StateService.instance

    constructor(props: TileDrawingProps) {
        super(props);
    }

    onTileSelected() {
        if (this.props.selectable && !this.props.isDiscard) {
            this.stateService.selectTile(this.props.tile)
        }
    }

    render() {
     return (
         <div className={'tile' + (this.props.isTsumo ? ' tile--tsumo' : '')} onClick={() => this.onTileSelected()}>
             <div className={'tile__inner' + (this.props.isDiscard ? ' tile__inner--discard' : '')}>
                 {this.props.isDiscard && (
                     <img className={'tile__box tile__box--discard'} src={discardTile}/>
                 )}
                 {!this.props.isDiscard && this.props.hidden  && (
                     <img className={'tile__box'} src={hiddenTile}/>
                 )}
                 {!this.props.isDiscard && !this.props.hidden  && (
                     <img className={'tile__box'} src={handTile}/>
                 )}
                 {!this.props.hidden  && (
                     <img className={'tile__drawing' + (this.props.isDiscard ? ' tile__drawing--discard' : ' tile__drawing--hand')}
                          src={TileService.getSvg(this.props.tile)}/>
                 )}
             </div>
         </div>
     )
    }
}