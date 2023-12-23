import { useEffect, useRef } from "react";

const VideoPlayer = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => (ref.current.srcObject = stream));
  }, []);

  return (
    <div className="videoPlayerWrapper">
      <video
        style={{ width: "550px", height: "300px" }}
        playsInline
        autoPlay
        ref={ref}
      />
      <h6>{props.userName}</h6>
    </div>
  );
};
export default VideoPlayer;
