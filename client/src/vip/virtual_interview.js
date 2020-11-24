import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button} from 'react-bootstrap'
import {ModalDialog, QuestionDialog} from './dialog'
import terms_and_conditions from './term'
import RecordRTCPromisesHandler from 'recordrtc'
import config from './config'

/* Import bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

// Import stylesheets ...
import './css/vip.css'
import axios from 'axios';

class WebcamStreamCapture extends Component {
  constructor(props){
    super(props)

    this.state = {'host':config['host'], 'timer':'00:00', 'streamRecorder':null,'webcamStream':null}
    this.componentDidMount = this.componentDidMount.bind(this)
    this.onSetRole = this.onSetRole.bind(this)
    this.startInterview = this.startInterview.bind(this)
  }

  componentWillUnmount() {
    
  }

  componentDidMount = async function(){
    var constraints = { audio: false, video: { width: 1280, height: 720 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(mediaStream) {
        var video = document.querySelector("#user-camera");
        this.setState({'webcamStream' : mediaStream})
        this.setState({'streamRecorder' : new RecordRTCPromisesHandler(mediaStream, {type:'video'})})

        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.

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

  padDigits = function(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
  }

  startInterview = function (index) {
    ReactDOM.render(<QuestionDialog text={this.state.questions[index].question} question_no={index+1}/>, document.getElementById('question-dialog-region'))
    
    var times_in_seconds = 10
    var timeInterval = setInterval(()=>{
      if(times_in_seconds <= 0){
        clearInterval(timeInterval)
        this.startRecording()
      }
      var seconds = this.padDigits(times_in_seconds % 60,2)
      var minutes = this.padDigits((times_in_seconds - seconds) / 60,2)
      this.setState({'timer':`${minutes}:${seconds}`})
      times_in_seconds -= 1
    }, 1000)
  }

  // triggered when the preparation time is over
  // start the recordrtc recorder
  startRecording = async function() {
    this.state.streamRecorder.startRecording()
    const sleep = m => new Promise(r => setTimeout(r, m))
    await sleep(3000)
 
    await this.state.streamRecorder.stopRecording()
    let blob = await this.state.streamRecorder.recorder.getBlob()
    
    // Now that we got the video blob, upload it to server
    var formData = new FormData()
    formData.append('video', blob)

    axios({
      url : `https://${this.state.host}:8080/vip/upload`,
      method : 'POST',
      data : formData,
      headers : {
        'Content-Type' : 'multipart/form-data'
      }
    }).then(response => response.data)
    .then(response => {
      alert(response)
    })
  }

  onSetRole(){
    this.setState({'selected_role_text' : localStorage.getItem('selected_role_text')})
    this.startInterview(0)
  }

  render() {
    return (
      <div id='camera-container'>
        <ModalDialog onSetRole={this.onSetRole}/>
        <div id='question-dialog-region'></div>
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
            <h1>{this.state.timer}</h1>
          </div>
        </div>
      </div>
    )
  }
}
export default   WebcamStreamCapture;
  // https://www.npmjs.com/package/react-webcam
  