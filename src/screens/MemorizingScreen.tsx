import * as React from "react";
import {TileVisual} from "../components/TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'

type MemorizingScreenState = {
    remainingTime: string
}

export class MemorizingScreen extends React.Component<any, MemorizingScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            remainingTime: '0',
        }
    }

    componentDidMount(): void {
        this.stateService.onTimeChanged.add(this.onTimeChanged, this)
        this.stateService.setTimer()
    }

    componentWillUnmount(): void {
        this.stateService.onTimeChanged.remove(this.onTimeChanged, this)
    }

    onTimeChanged() {
        this.setState({
            remainingTime: this.stateService.remainingTimeStr,
        })
    }

    goNext() {
        this.stateService.nextScreen()
    }

    render() {
        return (
            <div>
                <div className={'page-header'}>
                    <div className={'page-header__title'}>
                        Remember the hand
                    </div>
                </div>
                <div className={'page-content'}>
                    <div className={'flex-container flex-container--between'}>
                        <div className={'timer'}>
                            {this.state.remainingTime}
                        </div>

                        <div className={'flat-btn flat-btn--green'} >
                            <div className={'flat-btn__caption'} onClick={() => this.goNext()}>Ready!</div>
                        </div>
                    </div>

                    <HandVisual selectable={false} reverse={false} hiddenTiles={false} />
                </div>
            </div>
        )
    }
}