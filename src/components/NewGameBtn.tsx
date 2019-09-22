import * as React from "react";
import {StateService} from '../services/StateService'

type NewGameBtnProps = {
    onClick?: () => void
}

export class NewGameBtn extends React.Component<NewGameBtnProps> {
    stateService: StateService = StateService.instance

    constructor(props: NewGameBtnProps) {
        super(props)

        this.state = {
            tiles: this.stateService.discard
        }
    }

    onNewGameClick() {
        // @ts-ignore
        ym(55440343, 'reachGoal', 'NEW_GAME')

        if (this.props.onClick) {
            this.props.onClick()
        }
        this.stateService.nextScreen()
    }

    render() {
     return (
         <div className={'flat-btn flat-btn--white'} >
             <div className={'flat-btn__caption'} onClick={() => this.onNewGameClick()}>New game</div>
         </div>
     )
    }
}