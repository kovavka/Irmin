import * as React from "react";
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {Footer} from '../components/Footer'
import {NewGameBtn} from '../components/NewGameBtn'

export class SuccessScreen extends React.Component {
    render() {
     return (
         <div>
             <div className={'page-header'}>
                 <div className={'page-header__title'}>
                     SUCCESS
                 </div>
             </div>
             <div className={'page-content'}>
                 <div className={'flex-container flex-container--end'}>
                     <NewGameBtn/>
                 </div>

                 <HandVisual selectable={false} isOpenHand={true} reverse={false} hiddenTiles={false}/>
                 <DiscardVisual/>
             </div>
             <Footer/>
         </div>
     )
    }
}