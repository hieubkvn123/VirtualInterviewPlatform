import logo from './logo.svg'
import './App.css'
import SignUpForm from './auth/signup'
import LoginForm from './auth/login'
import HorizontalBar from './auth/horizontal_bar'
import WebcamStreamCapture from './vip/virtual_interview'

import {
  BrowserRouter as Router ,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import { LastLocationProvider } from 'react-router-last-location'

function App() {
  return (
    <div className="App">
      <div class='bg'></div>

      <HorizontalBar/>

      <Router>
        <LastLocationProvider>
          <Switch>
            <Route path='/signup'>
              <SignUpForm/>
            </Route>
            <Route path='/login'>
              <LoginForm/>
            </Route>
            <Route path='/vip'>
              <WebcamStreamCapture/>
            </Route>
            <Route exact path='/' render={()=>{
								{/* Redirect to /home when endpoint is empty */}
								return (<Redirect to='/signup'/>)
							}}/>
          </Switch>
        </LastLocationProvider>
      </Router>
		</div>
  );
}

export default App;

