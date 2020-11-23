import React, { Component } from 'react'
import axios from 'axios'
import config from './config'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/signup.css'

class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {'host':config['host']}

		// bind with hooks
		this.onChange = this.onChange.bind(this)
		this.onLogin = this.onLogin.bind(this)
	}

	componentWillMount() {
		/***
		axios({
			url : 'http://localhost:8080/',
			method : 'post',
			headers : {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => response.data)
			.then(response => {
				this.setState({'text' : response})
			})

		***/
	}

	componentWillUnmount() {

	}

	onChange = function(e) {
		console.log(this.state.host)
		this.setState({[e.target.name] : e.target.value})
	}

	onLogin = function(e) {
		var formData = new FormData()
		formData.append('email', this.state['email'])
		formData.append('password', this.state['password'])

		axios({
			url : `http://${this.state.host}:8080/auth/login`,
			method : 'POST',
			data : formData,
			headers : {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => response.data)
		.then(response => {
			if(response == 'success') {
				alert('Logged in successfully')
			}else if(response == 'fail'){
				alert('Email or password is incorrect')
			}
		})
	}

	render() {
		return (
			<div className='auth-form' id='login-form'>
				<h1 style={{'font-weight':'bolder'}}>Login</h1>
				<hr/>
				<form method='POST' action='http://localhost:8080/auth/login'>
					<label for='email'>Email</label>
					<input placeholder='Personal email' id='email' name='email' type='text' class='form-control' onChange={this.onChange}/>

					<label for='password'>Password</label>
					<input placeholder='Password' id='password' name='password' type='password' class='form-control' onChange={this.onChange}/>
					
					<table id='btn-panel'>
						<tr>
							<td><a href='/signup'><button type='button' id='signup-button' class='form-btn btn btn-primary'>Sign Up</button></a></td>
							<td><button type='button' id='login-button' class='form-btn btn btn-primary' onClick={this.onLogin}>Log in</button></td>
						</tr>
					</table>
				</form>
			</div>
		)
	}
}

export default LoginForm;
