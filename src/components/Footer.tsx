import * as React from "react";
import {StateService} from '../services/StateService'

export class Footer extends React.Component {
    stateService: StateService = StateService.instance

    onRulesClick() {
        this.stateService.openRules()
    }

    onSettingsClick() {
        this.stateService.openSettings()
    }

    onAboutClick() {
        this.stateService.openAbout()
    }

    render() {
     return (
         <div className={'page-footer'}>
             <div className={'flex-container flex-container--center flex-container--margin-s'}>
                 <div className={'page-footer__link'} onClick={() => this.onRulesClick()}>
                     Rules
                 </div>
                 <div className={'page-footer__separator'}></div>
                 <div className={'page-footer__link'} onClick={() => this.onSettingsClick()}>
                     Settings
                 </div>
                 <div className={'page-footer__separator'}></div>
                 <div className={'page-footer__link'} onClick={() => this.onAboutClick()}>
                     About
                 </div>
             </div>
         </div>
     )
    }
}