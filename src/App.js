import { Books } from './components/Books';
import { Page1 } from './components/Page1';
import { Login } from './components/Login'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Books />
        <Page1/>
        <Login/>
      </header>
    </div>
  );
}

export default App;
