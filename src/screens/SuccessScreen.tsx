import * as React from "react";
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'
import {Footer} from '../components/Footer'

export class SuccessScreen extends React.Component {
    stateService: StateService = StateService.instance

    onNewGameClick() {
        this.stateService.nextScreen()
    }

    render() {
     return (
         <div>
             <div className={'page-header'}>
                 <div className={'page-header__title'}>
                     SUCCESS
                 </div>
             </div>
             <div className={'page-content'}>
                 <div className={'flex-container'}>
                     <div className={'flat-btn flat-btn--white'} >
                         <div className={'flat-btn__caption'} onClick={() => this.onNewGameClick()}>New game</div>
                     </div>
                 </div>

                 <HandVisual selectable={false} reverse={false} hiddenTiles={false}/>
                 <DiscardVisual/>
             </div>
             <Footer/>
         </div>
     )
    }
}