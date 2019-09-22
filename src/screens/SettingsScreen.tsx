import * as React from 'react'
import {StateService} from '../services/StateService'
import {NewGameBtn} from '../components/NewGameBtn'
import {Switch} from '../components/Switch'

export class SettingsScreen extends React.Component {
    stateService: StateService = StateService.instance

    onOkClick() {
        // this.stateService.setSettings()
    }

    value = false

    setValue() {
        this.value = !this.value
        this.setState({})
    }

    render() {
     return (
         <div className='rules'>
             <div className='page-header'>
                 <div className='page-header__title'>
                     Settings
                 </div>
             </div>
             <div className='page-content'>
                 <div className='settings'>
                     <div className='flex-container'>
                        <Switch
                            switched={this.value}
                            onToggle={() => this.setValue()}
                        />
                        <div>Default settings</div>
                     </div>
                 </div>
                 <div className='flex-container flex-container--end'>
                     <NewGameBtn onClick={() => this.onOkClick()}/>
                 </div>
             </div>
         </div>
     )
    }
}