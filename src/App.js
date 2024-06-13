import logo from './logo.svg';
import './App.css';
import { Books } from './components/Books';
import { Page1 } from './components/Page1';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        
        <Books />
        <Page1/>
        
      </header>
    </div>
  );
}

export default App;
