import * as React from "react";
import {Tile} from "../types/Tile";
import {TileService} from "../services/TileService";
import discardTile from '../img/tile-fallen.svg'
import hiddenFallenTile from '../img/tile-hidden-fallen.svg'
import handTile from '../img/tile-hand.svg'
import hiddenTile from '../img/tile-hidden.svg'
import './tile.less';
import {StateService} from '../services/StateService'

type TileVisualProps = {
    tile: Tile,
    isTsumo: boolean,
    highlighted: boolean,
    isFallen: boolean,
    selectable: boolean,
    hidden: boolean,
}

type TileVisualState = {
    isDropped: boolean
}

export class TileVisual extends React.Component<TileVisualProps, TileVisualState> {
    stateService: StateService = StateService.instance

    constructor(props: TileVisualProps) {
        super(props);
        this.state = {
            isDropped: false,
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
            isDropped: false,
        })
    }

    onTileSelected() {
        if (this.props.selectable) {
            //todo not a great solution for discard visualisation
            this.setState({
                isDropped: true,
            })

            this.stateService.selectTile(this.props.tile)
        }
    }

    render() {
     return (
         <div className={'tile' + (this.props.isTsumo ? ' tile--tsumo' : '') + (this.props.isFallen ? ' tile--discard' : '')} onClick={() => this.onTileSelected()}>
             {this.props.isFallen && this.props.highlighted && (
                <div className='tile__mask'></div>
             )}
             <div className={'tile__inner'}>
                 {this.state.isDropped && (
                     <div className={'tile__box'}></div>
                 )}
                 {!this.state.isDropped && this.props.isFallen && (
                     <img className={'tile__box tile__box--discard'} src={discardTile}/>
                 )}

                 {!this.state.isDropped && !this.props.isFallen && this.props.hidden  && (
                     <img className={'tile__box'} src={hiddenTile}/>
                 )}
                 {!this.state.isDropped && !this.props.isFallen && !this.props.hidden  && (
                     <img className={'tile__box'} src={handTile}/>
                 )}
                 {!this.state.isDropped && !this.props.hidden  && (
                     <img className={'tile__drawing' + (this.props.isFallen ? ' tile__drawing--discard' : ' tile__drawing--hand')}
                          src={TileService.getSvg(this.props.tile)}/>
                 )}
             </div>
         </div>
     )
    }
}