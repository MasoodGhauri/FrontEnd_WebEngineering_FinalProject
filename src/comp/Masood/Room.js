import React, { useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { useParams } from "react-router";
import VideoPlayer from "./VideoPlayer";

const Room = () => {
  const [peers, setPeers] = useState([]);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const socketRef = useRef();
  const userVideo = useRef();
  const userStream = useRef();
  const peersRef = useRef([]);
  const params = useParams();
  const roomID = params.roomID;
  let flag = true;
  const [screenShare, setScreenShare] = useState(false);
  const screenTrackRef = useRef();

  const enter = () => {
    socketRef.current = io.connect("http://localhost:3001");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;
        userVideo.current.muted = true;

        socketRef.current.emit("b-join room", roomID);
        socketRef.current.on("f-users joined", (users) => {
          const temp = [];

          users.forEach((userID) => {
            // Check if the peer with the same ID is already in the peers state
            const existingPeer = peers.find((peer) => peer.peerID === userID);

            if (!existingPeer) {
              // Peer is not already in the state, create a new one
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              temp.push({
                peerID: userID,
                peer,
              });
            } else {
              // Peer is already in the state, push the existing one
              temp.push(existingPeer);
            }
          });
          setPeers(temp);
        });

        socketRef.current.on("f-get request", ({ signal, from }) => {
          // Check if the peer with the same ID is already in the peers state
          const existingPeer = peers.find((peer) => peer.peerID === from);

          if (!existingPeer) {
            // Peer is not already in the state, add a new peer
            const peer = addPeer(signal, from, stream);
            peersRef.current.push({
              peerID: from,
              peer,
            });
            const peerObj = {
              peer,
              peerID: from,
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

        // socketRef.current.on("user left", (id) => {
        //   console.log("User left: " + id);
        //   const peerObj = peersRef.current.find((p) => p.peerID === id);
        //   if (peerObj) {
        //     peerObj.peer.destroy();
        //   }

        //   const peers = peersRef.current.filter((p) => p.peerID !== id);
        //   peersRef.current = peers;
        //   setPeers(peers);
        // });

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
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 1000);
      console.log("User left: " + id);
      console.log(peersRef.current);
      console.log(peers);
      const peerObj = peersRef.current.find((p) => p.peerID === id);

      console.log(peerObj);
      if (peerObj) {
        // Peer with the specified ID exists

        // Update peersRef.current and state to exclude the removed peer
        const updatedPeers = peersRef.current.filter((p) => p.peerID !== id);
        console.log(updatedPeers);
        peerObj.peer.destroy();
        peersRef.current = updatedPeers;

        // let tempPeers = peers;
        // tempPeers.forEach((p) => {
        //   if (p.peerID === id) {
        //     tempPeers.splice(tempPeers.indexOf(p), 1);
        //   }
        // });
        // setPeers(tempPeers);
        setPeers((prevPeers) => prevPeers.filter((p) => p.peerID !== id));
        // setPeers(updatedPeers);
      } else {
        // Peer with the specified ID does not exist
        console.log(`Peer with ID ${id} not found.`);
      }
    }
  };

  return (
    <div>
      <video
        style={{ width: "550px", height: "300px" }}
        muted
        ref={userVideo}
        autoPlay
        playsInline
      />
      {peers.map((p, key) => {
        return <VideoPlayer key={p.peerID} peer={p.peer} />;
      })}
      <button onClick={muteAudio}>Audio</button>
      <button onClick={muteVideo}>Video</button>
      <button onClick={clickScreenSharing}>
        {screenShare ? "Stop Screen Share" : "Start Screen Share"}
      </button>
      <button onClick={enter}>Enter</button>
    </div>
  );
};

export default Room;
