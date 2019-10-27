import * as React from "react";
import {Tile} from "../types/Tile";
import {TileService} from "../services/TileService";
import './tile.less';
import {StateService} from '../services/StateService'

type TileVisualProps = {
    index?: number,
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
        if (this.props.selectable && this.props.index !== undefined) {
            //todo not a great solution for discard visualisation
            this.setState({
                isDropped: true,
            })

            this.stateService.selectTile(this.props.index)
        }
    }

    render() {
     return (
         <div className={`tile ${this.props.isTsumo ? ' tile--tsumo' : ''} ${this.props.highlighted ? ' tile--highlighted' : ''}`}
              onClick={() => this.onTileSelected()}>
             <div className={'tile__inner'}>
                 {/*empty space*/}
                 {this.state.isDropped && (
                     <div className={'tile__box'}></div>
                 )}

                 {/*discard or kan*/}
                 {!this.state.isDropped && this.props.isFallen && !this.props.hidden && (
                     <svg viewBox={'0 0 300 370'} className='tile__box tile__box--discard'>
                         <use xlinkHref='#tile-fallen'></use>
                     </svg>
                 )}
                 {!this.state.isDropped && this.props.isFallen && this.props.hidden && (
                     <svg viewBox={'0 0 300 370'} className='tile__box tile__box--discard'>
                         <use xlinkHref='#tile-hidden-fallen'></use>
                     </svg>
                 )}

                 {/*hand tiles*/}
                 {!this.state.isDropped && !this.props.isFallen && this.props.hidden  && (
                     <svg viewBox={'0 0 300 470'} className='tile__box'>
                         <use xlinkHref='#tile-hidden'></use>
                     </svg>
                 )}
                 {!this.state.isDropped && !this.props.isFallen && !this.props.hidden  && (
                     <svg viewBox={'0 0 300 470'} className='tile__box'>
                        <use xlinkHref='#tile-hand'></use>
                     </svg>
                 )}
                 {!this.state.isDropped && !this.props.hidden  && (
                     <svg viewBox={'0 0 300 400'}
                         className={'tile__drawing' + (this.props.isFallen ? ' tile__drawing--discard' : ' tile__drawing--hand')}>
                         <use xlinkHref={`#${TileService.getSvg(this.props.tile)}`}></use>
                     </svg>
                 )}
             </div>
         </div>
     )
    }
}