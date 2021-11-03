import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Switch, useHistory, withRouter } from 'react-router-dom'

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import 'semantic-ui-css/semantic.min.css';

import firebase from './firebase';

const Root = () => {
  const history = useHistory();
  useEffect(() => {
    // listens for user and redirects to homepage if they go to login page manually
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        history.push('/');
      }
    });
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
    </Switch>
  )
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RootWithAuth />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
