import * as React from "react";
import {Tile} from "../types/Tile";
import {TileService} from "../services/TileService";
import './tile.less';
import {StateService} from '../services/StateService'

type TileVisualProps = {
    tile: Tile,
    isTsumo: boolean,
    isOpen: boolean,
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
         <div className={'tile' + (this.props.isTsumo ? ' tile--tsumo' : '') + (this.props.isOpen ? ' tile--discard' : '')} onClick={() => this.onTileSelected()}>
             <div className={'tile__inner'}>
                 {this.state.isDropped && (
                     <div className={'tile__box'}></div>
                 )}
                 {!this.state.isDropped && this.props.isOpen && (
                     <svg viewBox={'0 0 300 370'} className='tile__box tile__box--discard'>
                         <use xlinkHref='#tile-discard'></use>
                     </svg>
                 )}
                 {!this.state.isDropped && !this.props.isOpen && this.props.hidden  && (
                     <svg viewBox={'0 0 300 470'} className='tile__box'>
                         <use xlinkHref='#tile-hidden'></use>
                     </svg>
                 )}
                 {!this.state.isDropped && !this.props.isOpen && !this.props.hidden  && (
                     <svg viewBox={'0 0 300 470'} className='tile__box'>
                        <use xlinkHref='#tile-hand'></use>
                     </svg>
                 )}
                 {!this.state.isDropped && !this.props.hidden  && (
                     <svg viewBox={'0 0 300 400'}
                         className={'tile__drawing' + (this.props.isOpen ? ' tile__drawing--discard' : ' tile__drawing--hand')}>
                         <use xlinkHref={`#${TileService.getSvg(this.props.tile)}`}></use>
                     </svg>
                 )}
             </div>
         </div>
     )
    }
}