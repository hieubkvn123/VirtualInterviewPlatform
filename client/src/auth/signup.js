import React, { Component } from 'react'
import axios from 'axios'
import config from './config'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/signup.css'

class SignUpForm extends Component {
	constructor(props) {
		super(props)
		this.state = {'host': config['host']}

		// bind with hooks
		this.onChange = this.onChange.bind(this)
		this.onSignUp = this.onSignUp.bind(this)
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
		this.setState({[e.target.name] : e.target.value})
	}

	onSignUp = function(e) {
		var formData = new FormData()
		formData.append('name', this.state['name'])
		formData.append('email', this.state['email'])
		formData.append('affiliation', this.state['company-name'])

		axios({
			url : `http://${this.state.host}:8080/auth/signup`,
			method : 'POST',
			data : formData,
			headers : {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => response.data)
		.then(response => {
			if(response == 'success') {
				alert('You have registered successfully, the password has been sent to your email')
			}else if(response == 'exist'){
				alert('The user email has already existed')
			}
		})
	}

	render() {
		return (
			<div className='auth-form' id='login-form'>
				<h1 style={{'font-weight':'bolder'}}>Sign Up</h1>
				<hr/>
				<form method='POST' action='http://localhost:8080/auth/login'>
					<label for='name'>Name</label>
					<input placeholder='Full Name' id='name' name='name' type='text' class='form-control' onChange={this.onChange}/>

					<label for='email'>Email</label>
					<input placeholder='Personal email' id='email' name='email' type='text' class='form-control' onChange={this.onChange}/>

					<label for='company-name'>Company Name</label>
					<input placeholder='Organization Name' id='company-name' name='company-name' type='text' class='form-control' onChange={this.onChange}/>
					
					<table id='btn-panel'>
						<tr>
							<td><button type='button' id='signup-button' class='form-btn btn btn-primary' onClick={this.onSignUp}>Sign Up</button></td>
							<td><a href='/login'><button type='button' id='login-button' class='form-btn btn btn-primary'>Log in</button></a></td>
						</tr>
					</table>
				</form>
			</div>
		)
	}
}

export default SignUpForm;
