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
                     You need to remember a hand for 1 min.
                     <br/><br/>
                     Then you will see the hand as if it is your opponent hand — all tiles will be face down (except for the tsumo) and sorted in the reverse order:
                     <br/><br/>
                     Pei, Shaa, Nan, Ton, Chun, Hatsu, Haku, 9-1 sou, 9-1 pin, 9-1 man.
                     <br/><br/>
                     <ExampleHandVisual/>
                     <br/><br/>
                     Each turn you will have only 10 seconds to choose the tile you want to discard (from your hand or tsumo). After the time, a tsumo will be thrown off.
                     <br/><br/>
                     Your goal is to complete a tempai. As soon as this happens press the tempai button and select the last tile to discard.
                     <br/><br/>
                     If your change your mind or make a mistake press the button to continue collecting hand.
                 </div>
                 <div className={'flex-container'}>
                     <div className={'flat-btn flat-btn--green'}>
                         <div className={'flat-btn__caption'} onClick={() => this.onOkClick()}>Got it!</div>
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}