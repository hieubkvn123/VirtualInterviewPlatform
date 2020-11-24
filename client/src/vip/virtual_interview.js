import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import terms_and_conditions from './term'
import Webcam from 'react-webcam'

// Import stylesheets ...
import './css/vip.css'

function ModalDialog() {
  const [show, setShow] = React.useState(true);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName='terms-and-conditions-dialog'>
        <Modal.Header closeButton>
          <Modal.Title><h1>Terms and Conditions</h1></Modal.Title>
        </Modal.Header>
          <Modal.Body style={{'max-height': 'calc(100vh - 300px)', 'overflow-y': 'auto'}}>{terms_and_conditions}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

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
        <ModalDialog/>
        <video id='user-camera' autoPlay={true} src={this.videoSrc}></video>
        <p id='info'></p>
      </div>
    )
  }
}
export default   WebcamStreamCapture;
  // https://www.npmjs.com/package/react-webcam
  