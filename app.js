const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let remoteStream;
let peerConnection;

// Start the video call
startButton.addEventListener('click', startCall);

// Stop the video call
stopButton.addEventListener('click', stopCall);

// Function to start the call
async function startCall() {
  try {
    // Get local media stream
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
    // Display local video stream
    localVideo.srcObject = localStream;
    
    // Create a peer connection
    peerConnection = new RTCPeerConnection();
    
    // Add local stream to the peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    // Handle incoming remote stream
    peerConnection.ontrack = event => {
      remoteStream = event.streams[0];
      remoteVideo.srcObject = remoteStream;
    };
    
    // Generate offer SDP
    const offer = await peerConnection.createOffer();
    
    // Set local description and send offer to remote peer
    await peerConnection.setLocalDescription(offer);
    
    // TODO: Send the offer to the remote peer (using signaling server or other method)
  } catch (error) {
    console.error('Error starting the call:', error);
  }
}

// Function to stop the call
function stopCall() {
  // Close the peer connection
  if (peerConnection) {
    peerConnection.close();
  }
  
  // Stop local media tracks
  localStream.getTracks().forEach(track => {
    track.stop();
  });
  
  // Reset video elements
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}
