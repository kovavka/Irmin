import * as React from 'react'
import {StateService} from '../services/StateService'
import {ExampleHandVisual} from '../components/ExampleHandVisual'

export class RulesScreen extends React.Component {
    stateService: StateService = StateService.instance

    onOkClick() {
        this.stateService.nextScreen()
    }

    render() {
     return (
         <div className={'rules'}>
             <div className={'page-header'}>
                 <div className={'page-header__title'}>
                     How to play
                 </div>
             </div>
             <div className={'page-content'}>
                 <div className={'rules'}>
                     You have one minute to remember a hand.
                     <br/><br/>
                     When you are ready, the hand is shown to you as if it is your opponent's hand — you see the back of the tiles and they are sorted in the reverse order:
                     <br/><br/>
                     Pei, Shaa, Nan, Ton, Chun, Hatsu, Haku, 9-1 sou, 9-1 pin, 9-1 man.
                     <br/><br/>
                     <ExampleHandVisual/>
                     <br/><br/>
                     After each draw you have 20 seconds to discard a tile. When the time runs out, tsumo tile is discarded.
                     <br/><br/>
                     Your goal is to complete tempai. When you believe you got tempai, press the "Tempai" button and select the last tile to discard.
                     <br/><br/>
                     If you want to stop or you have made a mistake you cannot fix, press the "Give up" button - current hand state will be shown to you.
                 </div>
                 <div className={'flex-container flex-container--end'}>
                     <div className={'flat-btn flat-btn--green'}>
                         <div className={'flat-btn__caption'} onClick={() => this.onOkClick()}>Got it!</div>
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}