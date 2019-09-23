import * as React from 'react'
import {StateService} from '../services/StateService'

export class AboutScreen extends React.Component {
    stateService: StateService = StateService.instance

    onOkClick() {
        this.stateService.nextScreen()
    }

    render() {
     return (
         <div className={'about'}>
             <div className={'page-header'}>
                 <div className={'page-header__title'}>
                     About
                 </div>
             </div>
             <div className={'page-content'}>
                 <div className={'about'}>
                     Irmin is a God of <i>who knows what</i>. That's how much you know about your hand in this game.
                     <br/><br/>
                     This project is kind of riichi mahjong for two (but online and for one), memory trainer.
                     <br/><br/>
                     Repo: <a href={'https://github.com/kovavka/irmin'}>GitHub</a><br/>
                     Me:
                     <ul>
                         <li>
                             <a target={'blank'} href={'https://t.me/kovavka'}>t.me/kovavka</a>
                         </li>
                         <li>
                             <a target={'blank'} href={'mailto:kovavka@gmail.com'}>kovavka@gmail.com</a>
                         </li>
                     </ul>
                     <br/>
                     <br/>
                     Please, report bug if you get one.
                 </div>
                 <div className={'flex-container'}>
                     <div className={'flat-btn flat-btn--white'}>
                         <div className={'flat-btn__caption'} onClick={() => this.onOkClick()}>Back</div>
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}