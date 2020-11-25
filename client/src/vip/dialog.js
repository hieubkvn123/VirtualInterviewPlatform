import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import terms_and_conditions from './term'
import config from './config'

/* Import bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

// Import stylesheets ...
import './css/vip.css'

class ModalDialog extends Component {
  constructor(props){
    super(props)
    this.state = {
      'host' : config['host'],
      'show': true,
      'role_select_show':false, 
      'selected_role' : '1'
    }

    this.onSelectChange = this.onSelectChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSelectClose = this.handleSelectClose.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentWillUnmount() {

  }

  componentDidMount = async function() {
    if(localStorage.getItem('user.name') == undefined){
      alert('Please login first before accessing this site')
      window.location.replace('/signup')
    }
  }

  setShow(show) {
    this.setState({'show': show})
  }
  
  handleSelectClose(){
    this.setState({'role_select_show':false})
    this.props.onSetRole()
  }

  handleClose() {
    this.setState({'role_select_show':true})
    this.setShow(false);
  }

  onSelectChange = async function(event) {
    var index = event.nativeEvent.target.selectedIndex;
    var roleText = event.nativeEvent.target[index].text

    await this.setState({'selected_role' : event.target.value})
    await this.setState({'selected_role_text' : roleText})

    localStorage.setItem('selected_role_id', this.state.selected_role)
    localStorage.setItem('selected_role_text', this.state.selected_role_text)
    this.forceUpdate()
  }

  render(){
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName='terms-and-conditions-dialog'>
          <Modal.Header closeButton>
            <Modal.Title><h1>Terms and Conditions</h1></Modal.Title>
          </Modal.Header>
            <Modal.Body style={{'max-height': 'calc(100vh - 300px)', 'overflow-y': 'auto'}}>{terms_and_conditions}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        
        <Modal show={this.state.role_select_show} onHide={this.handleSelectClose} dialogClassName='role-select-dialog'>
          <Modal.Header closeButton>
            <Modal.Title><h1>Please select your role</h1></Modal.Title>
          </Modal.Header>
            <Modal.Body style={{'max-height': 'calc(100vh - 300px)', 'overflow-y': 'auto'}}>
              <select onChange={this.onSelectChange} id='role-select' className='form-control'>
                <option defaultValue value='1'>Human Resource</option>
                <option value='2'>Sales and Marketing</option>
                <option value='3'>Operation and Manufacturing</option>
                <option value='4'>Information Technology</option>
                <option value='5'>Finace and Accounting</option>
                <option value='6'>Research and Development/Engineering</option>
                <option value='7'>Supply chain management and Logistics</option>
              </select>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSelectClose}>
              Select
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

class QuestionDialog extends Component {
  constructor(props){
    super(props)
    this.state = {'show' : true}
  }

  componentDidMount() {
      setTimeout(() => {
        this.setState({'show':false})
      }, 5000)
  }

  render() {
    return (
      <>
        <Modal show={this.state.show}>
        <Modal.Header closeButton>
            <Modal.Title>Question Number {this.props.question_no}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.text}</Modal.Body>
        </Modal>
      </>
    )
  }
}

export {
    ModalDialog,
    QuestionDialog
}