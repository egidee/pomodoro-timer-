const { useState, useEffect, useRef } = React;

const App = () => {
  const defaultSession = 25;
  const defaultBreak = 5;

  const [breakLength, setBreakLength] = useState(defaultBreak);
  const [sessionLength, setSessionLength] = useState(defaultSession);
  const [timeLeft, setTimeLeft] = useState(defaultSession * 60);
  const [breaking, setBreaking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1;
        if (audioRef.current) audioRef.current.play();
        setBreaking(prevBreaking => !prevBreaking);
        return breaking ? sessionLength * 60 : breakLength * 60;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, breaking, breakLength, sessionLength]);

  const display = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:\${secs.toString().padStart(2, "0")}`;
  };

  const resetting = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setBreaking(false);
    setBreakLength(defaultBreak);
    setSessionLength(defaultSession);
    setTimeLeft(defaultSession * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startStop = () => {
    setIsRunning(prev => !prev);
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: "min-vh-100 bg-cover d-flex flex-column justify-content-center align-items-center" }, /*#__PURE__*/
    React.createElement("h1", null, "25+5 Clock"), /*#__PURE__*/
    React.createElement("div", { className: "d-flex column-gap-5 mb-4" }, /*#__PURE__*/
    React.createElement("section", { className: "d-flex flex-column align-items-center" }, /*#__PURE__*/
    React.createElement("h2", { id: "break-label" }, "Break Length"), /*#__PURE__*/
    React.createElement("div", { className: "d-flex align-items-center" }, /*#__PURE__*/
    React.createElement("button", { id: "break-decrement", onClick: () => !isRunning && breakLength > 1 && setBreakLength(breakLength - 1) }, /*#__PURE__*/
    React.createElement("i", { className: "bi bi-arrow-down-short fs-6" })), /*#__PURE__*/

    React.createElement("h3", { id: "break-length", className: "mx-2" }, breakLength), /*#__PURE__*/
    React.createElement("button", { id: "break-increment", onClick: () => !isRunning && breakLength < 60 && setBreakLength(breakLength + 1) }, /*#__PURE__*/
    React.createElement("i", { className: "bi bi-arrow-up-short fs-6" })))), /*#__PURE__*/




    React.createElement("section", { className: "d-flex flex-column align-items-center" }, /*#__PURE__*/
    React.createElement("h2", { id: "session-label" }, "Session Length"), /*#__PURE__*/
    React.createElement("div", { className: "d-flex align-items-center" }, /*#__PURE__*/
    React.createElement("button", { id: "session-decrement", onClick: () => {
        if (!isRunning && sessionLength > 1) {
          setSessionLength(sessionLength - 1);
          setTimeLeft((sessionLength - 1) * 60);
        }
      } }, /*#__PURE__*/
    React.createElement("i", { className: "bi bi-arrow-down-short fs-6" })), /*#__PURE__*/

    React.createElement("h3", { id: "session-length", className: "mx-2" }, sessionLength), /*#__PURE__*/
    React.createElement("button", { id: "session-increment", onClick: () => {
        if (!isRunning && sessionLength < 60) {
          setSessionLength(sessionLength + 1);
          setTimeLeft((sessionLength + 1) * 60);
        }
      } }, /*#__PURE__*/
    React.createElement("i", { className: "bi bi-arrow-up-short fs-6" }))))), /*#__PURE__*/





    React.createElement("section", { id: "timer-label", className: "border border-4 px-5 py-3 d-flex flex-column align-items-center rounded-4" }, /*#__PURE__*/
    React.createElement("div", null, breaking ? "Break" : "Session"), /*#__PURE__*/
    React.createElement("div", { id: "time-left", className: "fs-1 fw-bold" }, display(timeLeft))), /*#__PURE__*/


    React.createElement("section", { className: "d-flex mt-4 gap-4" }, /*#__PURE__*/
    React.createElement("button", { id: "start_stop", onClick: startStop, className: "btn btn-outline-primary" },
    isRunning ? /*#__PURE__*/React.createElement("i", { className: "bi bi-pause-fill fs-1" }) : /*#__PURE__*/React.createElement("i", { className: "bi bi-play-fill fs-1" })), /*#__PURE__*/

    React.createElement("button", { onClick: resetting, className: "btn btn-outline-danger" }, /*#__PURE__*/
    React.createElement("i", { id: "reset", className: "bi bi-arrow-repeat fs-1" }))), /*#__PURE__*/



    React.createElement("audio", { id: "beep", ref: audioRef, preload: "auto", src: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" })));


};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( /*#__PURE__*/React.createElement(App, null));