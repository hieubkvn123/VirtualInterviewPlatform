import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button} from 'react-bootstrap'
import {ModalDialog, QuestionDialog} from './dialog'
import terms_and_conditions from './term'
import RecordRTC from 'recordrtc'
import config from './config'

/* Import bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

// Import stylesheets ...
import './css/vip.css'
import axios from 'axios';

class WebcamStreamCapture extends Component {
  constructor(props){
    super(props)

    this.state = {
      'host':config['host'], 
      'timer':'00:00', 
      'streamRecorder':null,
      'webcamStream':null,
      'question_show' : false,
      'current_question_no' : 0,
      'current_question' : ''
    }

    this.componentWillMount = this.componentWillMount.bind(this)
    this.onSetRole = this.onSetRole.bind(this)
    this.startInterview = this.startInterview.bind(this)
    this.startRecording = this.startRecording.bind(this)

  }

  componentWillUnmount() {
    
  }

  componentWillMount = async function(){
    var constraints = { audio: false, video: { width: 1280, height: 720 } };
    var stream
    await navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(mediaStream) {
        var video = document.querySelector("#user-camera");
        stream = mediaStream
        // recorder = new RecordRTC(mediaStream, {type:'video'})

        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.

    this.mediaStream = stream 

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

  // startInterview function takes in an index which indicate the index of the question
  // this index will also be passed to startRecording.
  // Once the recording is completed, based on this index the system can track how far
  // the interviewee is done with the interview. From there decided whether to proceed or not
  startInterview = function (index) {
    // Flash the question on the screen
    this.setState({'current_question_no' : index + 1})
    this.setState({'current_question' : this.state.questions[index].question})
    this.setState({'question_show' : true})
    // After 5 seconds hide the question
    setTimeout(() => {
      this.setState({'question_show' : false})
    }, 5000)

    // Break time for interviewee to prepare
    var times_in_seconds = 10
    var timeInterval = setInterval(()=>{
      if(times_in_seconds <= 0){
        // Break over -> start question
        clearInterval(timeInterval)
        this.startRecording(index)
      }
      var seconds = this.padDigits(times_in_seconds % 60,2)
      var minutes = this.padDigits((times_in_seconds - seconds) / 60,2)
      this.setState({'timer':`${minutes}:${seconds}`})
      times_in_seconds -= 1
    }, 1000)
  }

  // triggered when the preparation time is over
  // start the recordrtc recorder
  startRecording = async function(index) {
    // get the recorder with the current media stream
    var recorder = new RecordRTC(this.mediaStream, {type:'video'})
    var host = this.state.host 

    // Start recording 
    recorder.startRecording()
    const sleep = m => new Promise(r => setTimeout(r, m))
    await sleep(3000)
 
    // After the desinated duration, stop recording
    recorder.stopRecording(async function(){
      let blob = recorder.getBlob()
      console.log(blob)

      // Now that we got the video blob, upload it to server
      var formData = new FormData()
      formData.append('video-blob', blob)
      formData.append('video-filename', 'test.webm')

      // Upload the video on the server
      await axios({
        url : `https://${host}:8080/vip/upload`,
        method : 'POST',
        data : formData,
        headers : {
          'Content-Type' : 'multipart/form-data'
        }
      }).then(response => response.data)
      .then(response => {
        console.log(response)
      })
    })
    // if the current question is not last, continue
    if(index + 1 < this.state.questions.length){
      this.startInterview(index + 1)
    }else{
      alert('This is the end of the interview.')
    }
  }

  onSetRole(){
    this.setState({'selected_role_text' : localStorage.getItem('selected_role_text')})
    this.startInterview(0)
  }

  render() {
    return (
      <div id='camera-container'>
        <ModalDialog onSetRole={this.onSetRole}/>
        <div id='question-dialog-region'>
          <Modal show={this.state.question_show}>
            <Modal.Header>
                <Modal.Title>Question Number {this.state.current_question_no}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.current_question}</Modal.Body>
          </Modal>
        </div>
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
  