import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import terms_and_conditions from './term'
import config from './config'

/* Import bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

// Import stylesheets ...
import './css/vip.css'
import axios from 'axios';

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

    // get the questions list from server
    await axios({
      url : `https://${this.state.host}:8080/vip/get_questions`,
      method : 'POST',
      headers : {
        'Content-Type' : 'multipart/form-data'
      }
    }).then(response => response.data)
    .then(response => {
      this.setState({'questions':response})
    })

    console.log(this.state.questions)
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
        ""
        <Modal show={this.state.role_select_show} onHide={this.handleSelectClose} dialogClassName='role-select-dialog'>
          <Modal.Header closeButton>
            <Modal.Title><h1>Please select your role</h1></Modal.Title>
          </Modal.Header>
            <Modal.Body style={{'max-height': 'calc(100vh - 300px)', 'overflow-y': 'auto'}}>
              <select onChange={this.onSelectChange} id='role-select' className='form-control'>
                <option selected value='1'>Human Resource</option>
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

class WebcamStreamCapture extends Component {
  constructor(props){
    super(props)

    this.state = {}
    this.componentDidMount = this.componentDidMount.bind(this)
    this.onSetRole = this.onSetRole.bind(this)
  }

  componentWillUnmount() {
    
  }

  componentDidMount(){
    var constraints = { audio: false, video: { width: 1280, height: 720 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(mediaStream) {
        var video = document.querySelector("#user-camera");

        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.
  }

  startInterview () {

  }

  onSetRole(){
    this.setState({'selected_role_text' : localStorage.getItem('selected_role_text')})
  }

  render() {
    return (
      <div id='camera-container'>
        <ModalDialog onSetRole={this.onSetRole}/>
        <video id='user-camera' autoPlay={true} src={this.videoSrc}></video>
        <p id='info'></p>
        <div id='information-region' style={{
          color : 'black'
        }}>
          <table>
            <tr>
              <th>Selected Role</th>
              <td>{this.state.selected_role_text}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{localStorage.getItem('user.email')}</td>
            </tr>
          </table>
          <div id='timer'>
            <h1>00:00</h1>
          </div>
        </div>
      </div>
    )
  }
}
export default   WebcamStreamCapture;
  // https://www.npmjs.com/package/react-webcam
  