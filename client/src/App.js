import logo from './logo.svg'
import './App.css'
import LoginForm from './auth/login'
import HorizontalBar from './auth/horizontal_bar'

function App() {
  return (
    <div className="App">
      <div class='bg'></div>
      <HorizontalBar/>
    	<LoginForm/>
		</div>
  );
}

export default App;

