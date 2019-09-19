import * as React from 'react'
import {StateService} from '../services/StateService'

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
                     blablabla
                 </div>

                 <div className={'button-container'}>
                     <div className={'flat-btn flat-btn--green'}>
                         <div className={'flat-btn__caption'} onClick={() => this.onOkClick()}>Got it!</div>
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}