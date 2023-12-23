import { useEffect, useRef } from "react";

const VideoPlayer = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => (ref.current.srcObject = stream));
  }, []);

  return (
    <video
      style={{ width: "550px", height: "300px" }}
      playsInline
      autoPlay
      ref={ref}
    />
  );
};
export default VideoPlayer;
