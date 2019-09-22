import * as React from "react";
import {StateService} from '../services/StateService'

type SwitchProps = {
    onToggle: () => void,
    switched: boolean
}

export class Switch extends React.Component<SwitchProps> {
    constructor(props: SwitchProps) {
        super(props)
    }

    onToggle() {
        this.props.onToggle()
    }

    render() {
     return (
         <label className='switch' onClick={() => this.onToggle()}>
             <span className={'switch__box' + (this.props.switched ? ' switch__box--on' : '')}></span>
             <span className={'switch__button' + (this.props.switched ? ' switch__button--on' : '')}></span>
         </label>
     )
    }
}