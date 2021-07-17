import React from 'react';
import '../src/styles/Global.css';
import { StyledSelectContextProvider } from './components/StyledSelect/StyledSelectContext';
import {CharactersProvider} from '../src/contexts/globalContexts/Characters';
import {PlayersProvider} from '../src/contexts/globalContexts/Player';
import {SpinnerClockProvider} from '../src/components/StyledComps/SpinnerClock/SpinnerClockContext';

import {Routes} from './Routes';

function App() {
  return (
    <div>
      <SpinnerClockProvider>
      <StyledSelectContextProvider>
        <CharactersProvider>
          <PlayersProvider>
            <Routes />
          </PlayersProvider>
        </CharactersProvider>
      </StyledSelectContextProvider>
      </SpinnerClockProvider>
    </div>
  );
}

export default App;
