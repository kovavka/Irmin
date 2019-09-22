import * as React from 'react'
import {StateService} from '../services/StateService'
import {NewGameBtn} from '../components/NewGameBtn'

export class SettingsScreen extends React.Component {
    stateService: StateService = StateService.instance

    onOkClick() {
        // this.stateService.setSettings()
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
                     <NewGameBtn onClick={() => this.onOkClick()}/>
                 </div>
             </div>
         </div>
     )
    }
}