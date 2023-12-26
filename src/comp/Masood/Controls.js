const Controls = ({
  muteVideo,
  cameraActive,
  muteAudio,
  micActive,
  screenSharing,
  screenShare,
  leave,
}) => {
  return (
    <div className="controlsWrapper">
      <button className="cntBtn" onClick={muteVideo}>
        {cameraActive ? (
          <span className="material-symbols-outlined">videocam_off</span>
        ) : (
          <span className="material-symbols-outlined">videocam</span>
        )}
      </button>
      <button className="cntBtn" onClick={muteAudio}>
        {micActive ? (
          <span className="material-symbols-outlined">mic_off</span>
        ) : (
          <span className="material-symbols-outlined">mic</span>
        )}
      </button>

      <button className="cntBtn" onClick={screenSharing}>
        {screenShare ? (
          <span className="material-symbols-outlined">stop_screen_share</span>
        ) : (
          <span className="material-symbols-outlined">screen_share</span>
        )}
      </button>
      <button className="cntBtn leave" onClick={leave}>
        <span className="material-symbols-outlined">call_end</span>
      </button>
    </div>
  );
};

export default Controls;
