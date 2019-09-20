import * as React from "react";
import {TileVisual} from "../components/TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'
import {Footer} from '../components/Footer'

type ProcessingScreenState = {
    debug: boolean
    choose: boolean
    remainingTime: string
}

export class ProcessingScreen extends React.Component<any, ProcessingScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            debug: false,
            choose: false,
            remainingTime: '0',
        }
    }

    componentDidMount(): void {
        this.stateService.onTimeChanged.add(this.onTimeChanged, this)
        this.stateService.setTimer()
        this.stateService.onChooseTempaiChanged.add(this.onChooseTempaiChanged, this)
        // this.stateService.onDebugChanged.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        this.stateService.onTimeChanged.remove(this.onTimeChanged, this)
        this.stateService.onChooseTempaiChanged.remove(this.onChooseTempaiChanged, this)
        // this.stateService.onDebugChanged.remove(this.updateState, this)
    }

    onTimeChanged() {
        this.setState({
            remainingTime: this.stateService.remainingTimeStr,
        })
    }

    onChooseTempaiChanged(value: boolean) {
        this.setState({
            choose: value
        })
    }

    // onDebugChanged(value: boolean) {
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
        this.stateService.chooseTempai(!this.state.choose)
    }

    onGiveUpClick() {
        this.stateService.nextScreen()
    }

    render() {
        return (
            <div>
                <div className={'page-header'}>
                    <div className={'page-header__title'}>
                        {!this.state.choose && (
                            'Drop a tile'
                        )}
                        {this.state.choose && (
                            'Select tempai'
                        )}
                    </div>
                </div>
                <div className={'page-content'}>
                    <div className={'flex-container flex-container--between'}>
                        <div className={'timer'}>
                            {this.state.remainingTime}
                        </div>
                        <div className={'flat-btn flat-btn--green' + (this.state.debug ? ' flat-btn--pressed' : '')} >
                            <div className={'flat-btn__caption'} onClick={() => this.onDebugClick()}>Debug</div>
                        </div>
                        <div className={'flat-btn flat-btn--blue' + (this.state.choose ? ' flat-btn--pressed' : '')} >
                            <div className={'flat-btn__caption'} onClick={() => this.onTempaiClick()}>Tempai!</div>
                        </div>
                    </div>

                    <HandVisual selectable={true} reverse={true} hiddenTiles={!this.state.debug}/>
                    <DiscardVisual/>

                    <div className={'flex-container'}>
                        <div className={'flat-btn flat-btn--blue'} >
                            <div className={'flat-btn__caption'} onClick={() => this.onGiveUpClick()}>Give up</div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}