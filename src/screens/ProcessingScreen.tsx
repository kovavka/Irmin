import * as React from "react";
import {TileVisual} from "../components/TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'

type ProcessingScreenState = {
    debug: boolean
    choose: boolean
}

export class ProcessingScreen extends React.Component<any, ProcessingScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            debug: false,
            choose: false,
        }
    }

    componentDidMount(): void {
        // this.stateService.onDebugChanged.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        // this.stateService.onDebugChanged.remove(this.updateState, this)
    }

    // updateState(value: boolean) {
    //     this.setState({
    //         debug: value,
    //     })
    // }

    onDebugClick() {
        this.setState({
            debug: !this.state.debug
        })
    }

    onTempaiClick() {
        this.setState({
            choose: !this.state.choose
        })
    }

    render() {
        return (
            <div>
                <div className={'page-header'}>
                    <div className={'page-header__title'}>
                        Drop a tile
                    </div>
                </div>
                <div className={'page-content'}>
                    <div className={'button-container'}>
                        <div className={'flat-btn flat-btn--green' + (this.state.debug ? ' flat-btn--pressed' : '')} >
                            <div className={'flat-btn__caption'} onClick={() => this.onDebugClick()}>Debug</div>
                        </div>
                        <div className={'flat-btn flat-btn--blue' + (this.state.choose ? ' flat-btn--pressed' : '')} >
                            <div className={'flat-btn__caption'} onClick={() => this.onTempaiClick()}>Tempai!</div>
                        </div>
                    </div>

                    <HandVisual selectable={true} reverse={true} hiddenTiles={!this.state.debug}/>
                    <DiscardVisual/>
                </div>
            </div>
        )
    }
}