

import { BrowserRouter  } from 'react-router-dom';
import InternalPages from './Routes';

function App() {
  return (
    <BrowserRouter>
      <InternalPages />
    </BrowserRouter>
  );
}

export default App;
