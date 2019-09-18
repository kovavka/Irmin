import React from 'react'
import './App.css'

import {HandService} from './services/HandService'
import {StateService} from './services/StateService'
import {SuccessScreen} from './screens/SuccessScreen'
import {ScreenType} from './types/ScreenType'
import {FailScreen} from './screens/FailScreen'
import {TempaiScreen} from './screens/TempaiScreen'
import {MemorizingScreen} from './screens/MemorizingScreen'
import {RulesScreen} from './screens/RulesScreen'

const App: React.FC = () => {

    const stateService = StateService.instance
    let r = stateService.currentScreen

    const service = new HandService()
    service.generate()


   return (
    <div className="App">

      <div className={'page-header'}>
        <div className={'page-header__title'}></div>
      </div>

        {stateService.currentScreen === ScreenType.RULES && (
            <RulesScreen/>
        )}
        {stateService.currentScreen === ScreenType.MEMORIZING && (
            <MemorizingScreen/>
        )}
        {(stateService.currentScreen === ScreenType.CHOOSE_TEMPAI ||
            stateService.currentScreen === ScreenType.GETTING_TEMPAI) &&
        (
            <TempaiScreen/>
        )}
        {stateService.currentScreen === ScreenType.SUCCESS && (
            <SuccessScreen/>
        )}
        {stateService.currentScreen === ScreenType.FAIL && (
            <FailScreen/>
        )}

        {/*<DiscardVisual tiles={discardTiles}/>*/}
    </div>
  );
}

export default App;
