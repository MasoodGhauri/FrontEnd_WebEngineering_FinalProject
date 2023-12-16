import { useEffect, useRef, useState } from "react";
import socket from "./Socket";
import SimplePeer from "simple-peer";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const Room = () => {
  const localVideo = useRef();
  const userStream = useRef();
  const user = sessionStorage.getItem("user");
  const { roomId } = useParams();
  const [videoDevices, setVideoDevices] = useState([]);
  const [remoteUsersVideoAudio, setRemoteUsersVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setVideoDevices(videoDevices);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideo.current.srcObject = stream;
        userStream.current = stream;

        socket.emit("b-user join", { roomId, userName: user });
        socket.on("f-users joined", (users) => {
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio } = info;

            if (userName !== user) {
              const peer = createPeer(userId, socket.id, stream);

              peer.userName = userName;
              peer.peerId = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              peers.push(peer);

              setRemoteUsersVideoAudio((pre) => {
                return {
                  ...pre,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });
          setPeers(peers);
        });

        socket.on("f-get request", ({ signal, from, info }) => {
          let { userName, video, audio } = info;
          const peerIdx = peersRef.current.findIndex((p) => p.peerID === from);
          if (peerIdx === -1) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;

            peersRef.current.push({
              peerID: from,
              peer,
              userName,
            });
            setPeers((pre) => [...pre, peer]);
            setRemoteUsersVideoAudio((pre) => {
              return {
                ...pre,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on("f-accepted connect", ({ signal, answerId }) => {
          peersRef.current
            .find((p) => p.peerID === answerId)
            .peer.signal(signal);
        });
      });
  }, []);

  const createPeer = (userId, from, stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("b-request connect", { userToConnect: userId, from, signal });
    });

    peer.on("disconnect", () => {
      peer.destroy();
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
      socket.emit("b-accept connect", { signal, to: from });
    });

    peer.on("disconnect", () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  };

  return (
    <div className="roomWrapper">
      <video ref={localVideo} muted autoPlay playsInline></video>
      {peers.map((peer, index, arr) => (
        <VideoPlayer key={index} peer={peer} number={arr.length} />
      ))}
    </div>
  );
};

export default Room;
