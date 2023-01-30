import React, { useRef, useEffect } from "react";

function Camra() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  function getVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((localMediaStream) => {
        console.log(localMediaStream);
        console.dir(videoRef.current);

        videoRef.current.srcObject = localMediaStream;
        var isPlaying =
          videoRef.current.currentTime > 0 &&
          !videoRef.current.paused &&
          !videoRef.current.ended &&
          videoRef.current.readyState > videoRef.current.HAVE_CURRENT_DATA;

        if (!isPlaying) {
          videoRef.current.play();
        }
        // videoRef.current.play();
      })
      .catch((err) => {
        console.error(`OH NO!!!`, err);
      });
  }

  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }

  function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
  }

  function paintToCanvas() {
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    const ctx = canvasRef.current.getContext("2d");

    return setInterval(() => {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      // take the pixels out
      let pixels = ctx.getImageData(0, 0, width, height);

      //   pixels = rgbSplit(pixels);
      // ctx.globalAlpha = 0.8;

      //   pixels = redEffect(pixels);
      // put them back
      ctx.putImageData(pixels, 0, 0);
    }, 1);
  }

  useEffect(() => {
    if (videoRef) {
      getVideo();
      videoRef.current.oncanplay = paintToCanvas;
    }
  }, [videoRef]);

  return (
    <div>
      <video style={{ display: "none" }} ref={videoRef}></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Camra;
