import * as React from 'react'
import {StateService} from '../services/StateService'
import {ExampleHandVisual} from '../components/ExampleHandVisual'

export class SettingsScreen extends React.Component {
    stateService: StateService = StateService.instance

    onOkClick() {
        // this.stateService.setSettings()
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

                 </div>
                 <div className={'flex-container'}>
                     <div className={'flat-btn flat-btn--white'}>
                         <div className={'flat-btn__caption'} onClick={() => this.onOkClick()}>New game</div>
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}