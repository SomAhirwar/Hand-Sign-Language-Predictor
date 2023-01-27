const ffmpeg = require("ffmpeg");
// const { isRegExp } = require("util");

const videoToFrames = (pathOfVideo, pathToFrames, fileName) => {
  try {
    console.log(pathOfVideo, pathToFrames, fileName);
    const process = new ffmpeg(pathOfVideo);
    process.then(
      function (video) {
        // Callback mode
        video.fnExtractFrameToJPG(
          pathToFrames,
          {
            // frame_rate: 1,
            number: 30,
            file_name: fileName + "_%t_%s",
          },
          function (error, files) {
            if (!error) console.log("Frames: " + files);
            else console.log("Error!!!!!!!!!!", error);
          }
        );
      },
      function (err) {
        console.log("Error: " + err);
      }
    );
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
};

const processVideoToFrames = (pathOfVideo, pathToFrames) => {
  var fs = require("fs");
  var path = require("path");

  var moveFrom = pathOfVideo;
  var moveTo = pathToFrames;
  // const moveFrom = "./videos/input";
  // const moveTo = "./videos/output";

  // Loop through all the files in the temp directory
  fs.readdir(moveFrom, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      // Make one pass and make the file complete
      var fromPath = path.join(moveFrom, file);
      var toPath = path.join(moveTo, file);

      fs.stat(fromPath, function (error, stat) {
        if (error) {
          console.error("Error stating file.", error);
          return;
        }

        if (stat.isFile()) {
          const extention = path.extname(file);
          const extentionsArr = [".mp4", ".avi"];
          if (extentionsArr.includes(extention)) {
            videoToFrames(moveFrom + "/" + file, moveTo, file);
          } else {
            console.log(extention + " is not A viode extention");
          }
        } else if (stat.isDirectory()) console.log("'%s' is a directory.", fromPath);

        // fs.rename(fromPath, toPath, function (error) {
        //   if (error) {
        //     console.error("File moving error.", error);
        //   } else {
        //     console.log("Moved file '%s' to '%s'.", fromPath, toPath);
        //   }
        // });
      });
    });
  });
};

module.exports = { videoToFrames, processVideoToFrames };
