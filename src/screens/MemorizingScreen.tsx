import * as React from "react";
import {TileVisual} from "../components/TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'

type DiscardState = {
    tiles: Tile[]
}

export class MemorizingScreen extends React.Component {
    stateService: StateService = StateService.instance

    // constructor(props: DiscardState) {
    //     super(props)
    // }

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
                    <div className={'button-container'}>
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