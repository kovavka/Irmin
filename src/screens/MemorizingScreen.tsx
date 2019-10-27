import * as React from "react";
import {HandVisual} from '../components/HandVisual'
import {StateService} from '../services/StateService'
import {Footer} from '../components/Footer'

type MemorizingScreenState = {
    useTimer: boolean
    remainingTime: string
}

export class MemorizingScreen extends React.Component<any, MemorizingScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            useTimer: this.stateService.useTimer,
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
        const {useTimer, remainingTime} = this.state
        return (
            <div>
                <div className={'page-header'}>
                    <div className={'page-header__title'}>
                        Remember the hand
                    </div>
                </div>
                <div className={'page-content'}>
                    <div className={'flex-container' + (useTimer ? ' flex-container--between' : ' flex-container--end')}>
                        {useTimer && (
                            <div className={'timer'}>
                                {remainingTime}
                            </div>
                        )}
                        <div className={'flat-btn flat-btn--green'} >
                            <div className={'flat-btn__caption'} onClick={() => this.goNext()}>Ready</div>
                        </div>
                    </div>

                    <HandVisual selectable={false} isOpenHand={false} reverse={false} hiddenTiles={false} />
                </div>
                <Footer/>
            </div>
        )
    }
}