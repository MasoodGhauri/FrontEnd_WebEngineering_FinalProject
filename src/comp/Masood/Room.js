import React, { useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { useParams } from "react-router";
import VideoPlayer from "./VideoPlayer";

const Room = () => {
  const user = sessionStorage.getItem("user");
  const [peers, setPeers] = useState([]);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const socketRef = useRef();
  const userVideo = useRef();
  const userStream = useRef();
  const peersRef = useRef([]);
  const params = useParams();
  const roomID = params.roomID;
  const [screenShare, setScreenShare] = useState(false);
  const screenTrackRef = useRef();
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);

  const enter = () => {
    socketRef.current = io.connect("http://localhost:3001");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;
        userVideo.current.muted = true;
        window.addEventListener("popstate", leave);
        window.addEventListener("beforeunload", leave);

        socketRef.current.emit("b-join room", { roomID, userName: user });
        socketRef.current.on("f-users joined", (users) => {
          const temp = [];

          users.forEach(({ id, userName }) => {
            // Check if the peer with the same ID is already in the peers state
            const existingPeer = peers.find((peer) => peer.peerID === id);

            if (!existingPeer) {
              // Peer is not already in the state, create a new one
              const peer = createPeer(id, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: id,
                userName,
                peer,
              });
              temp.push({
                peerID: id,
                userName,
                peer,
              });
            } else {
              // Peer is already in the state, push the existing one
              temp.push(existingPeer);
            }
          });
          setPeers(temp);
        });

        socketRef.current.on("f-get request", ({ signal, from, userName }) => {
          // Check if the peer with the same ID is already in the peers state
          const existingPeer = peers.find((peer) => peer.peerID === from);

          if (!existingPeer) {
            // Peer is not already in the state, add a new peer
            const peer = addPeer(signal, from, stream);
            peersRef.current.push({
              peerID: from,
              peer,
              userName,
            });
            const peerObj = {
              peer,
              peerID: from,
              userName,
            };

            setPeers((users) => [...users, peerObj]);
          } else {
            console.log(`Peer with ID ${from} already exists.`);
          }
        });

        socketRef.current.on("f-accepted connect", ({ signal, id }) => {
          const item = peersRef.current.find((p) => p.peerID === id);
          item.peer.signal(signal);
        });

        socketRef.current.on(
          "f-receive message",
          ({ message, userName, time }) => {
            console.log(message, userName, time);
          }
        );
        socketRef.current.on("f-recieve file", recieveFile);

        socketRef.current.on("user left", (id) => {
          handleLeave(id);
        });
      });
  };

  const createPeer = (userToConnect, from, stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("b-request connect", {
        userToConnect,
        from,
        signal,
        userName: user,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, from, stream) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("b-accept connect", { signal, from });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const muteAudio = () => {
    setMicActive(!micActive);
    userStream.current.getAudioTracks()[0].enabled =
      !userStream.current.getAudioTracks()[0].enabled;
  };

  const muteVideo = () => {
    setCameraActive(!cameraActive);
    userStream.current.getVideoTracks()[0].enabled =
      !userStream.current.getVideoTracks()[0].enabled;
  };

  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === "video"),
              screenTrack,
              userStream.current
            );
          });

          // Listen click end
          screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === "video"),
                userStream.current
              );
            });
            userVideo.current.srcObject = userStream.current;
            setScreenShare(false);
          };

          userVideo.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  const handleLeave = (id) => {
    const peerObj = peersRef.current.find((p) => p.peerID === id);

    if (peerObj) {
      // Update peersRef.current and state to exclude the removed peer
      const updatedPeers = peersRef.current.filter((p) => p.peerID !== id);
      peerObj.peer.destroy();
      peersRef.current = updatedPeers;

      setPeers((prevPeers) => prevPeers.filter((p) => p.peerID !== id));
    } else {
      // Peer with the specified ID does not exist
      console.log(`Peer with ID ${id} not found.`);
    }
  };
  const leave = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const sendMessage = () => {
    const time = getCurrentTime();
    socketRef.current.emit("b-send message", {
      message: msg,
      roomID,
      userName: user,
      time,
    });
    setMsg("");
  };
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
  };

  const sendFile = (e) => {
    e.preventDefault();
    if (file) {
      let toSend = {
        body: file,
        user,
        mimeType: file.type,
        fileName: file.name,
        time: getCurrentTime(),
      };
      socketRef.current.emit("b-send file", { roomID, body: toSend });
      setFile(null);
    }
  };
  const recieveFile = (data) => {
    const blob = new Blob([data.body], { type: data.mimeType });

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "filename";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <div>
        <video
          style={{ width: "550px", height: "300px" }}
          muted
          ref={userVideo}
          autoPlay
          playsInline
        />
        <h6>You: {user}</h6>
      </div>
      {peers.map((p, key) => {
        return (
          <VideoPlayer key={p.peerID} peer={p.peer} userName={p.userName} />
        );
      })}
      <button onClick={muteAudio}>Audio</button>
      <button onClick={muteVideo}>Video</button>
      <button onClick={clickScreenSharing}>
        {screenShare ? "Stop Screen Share" : "Start Screen Share"}
      </button>
      <button onClick={enter}>Enter</button>
      <input
        type="text"
        placeholder="Enter message"
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={sendFile}>Send File</button>
    </div>
  );
};

export default Room;
