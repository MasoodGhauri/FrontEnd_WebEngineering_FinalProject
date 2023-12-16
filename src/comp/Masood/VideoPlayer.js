import { useRef, useEffect } from "react";

const VideoPlayer = (props) => {
  const ref = useRef();
  const peer = props.peer;

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on("track", (track, stream) => {});
  }, [peer]);

  return <video ref={ref} playsInline autoPlay></video>;
};

export default VideoPlayer;
