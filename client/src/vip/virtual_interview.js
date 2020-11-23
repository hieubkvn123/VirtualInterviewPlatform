import React, {Component} from 'react'
import Webcam from 'react-webcam'

// Import stylesheets ...
import './css/vip.css'

class WebcamStreamCapture extends Component {
  constructor(props){
    super(props)

    this.state = {}
    this.componentDidMount = this.componentDidMount.bind(this)
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

  render() {
    return (
      <div id='camera-container'>
        <video id='user-camera' autoPlay={true} src={this.videoSrc}></video>
        <p id='info'></p>
      </div>
    )
  }
}
export default   WebcamStreamCapture;
  // https://www.npmjs.com/package/react-webcam
  