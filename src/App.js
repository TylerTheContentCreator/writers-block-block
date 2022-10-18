import logo from './logo.svg';
import './App.css';
import './app.scss'
import 'animate.css'
import { useRef, useState, useEffect, } from 'react';
import { Container, Row, Col, Form, Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import Confetti from 'react-confetti'
import { FaDownload, FaCopy, FaFrown } from 'react-icons/fa'

function App() {

  const [txt, setTxt] = useState('')
  const [wordGoal, setWordGoal] = useState(125)
  const [timer, setTimer] = useState(10)
  const [showTimer, setShowTimer] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [fiveTimer, setFiveTimer] = useState(300)
  const [fiveRunning, setFiveRunning] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [showToast, setShowToast] = useState(false)
  const txtInput = useRef()
  const savedRef = useRef()

  const [savedTxt, setSavedTxt] = useState('')
  const [disableInput, setDisableInput] = useState(false)
  const [showFail, setShowFail] = useState(false)

  const audio = new Audio(require('./ding.wav'))

  var timerInterval = null;
  var fiveInterval = null;

  useEffect(() => {

  }, [])


  const clearEverything = () => {
    setDisableInput(true)
    setFiveRunning(false)
    setTimerRunning(false)
    clearInterval(fiveInterval)
    clearInterval(timerInterval)
    setTimer(10)
    setFiveTimer(300)

    if (txtInput.current.value.trim().split(/\s+/).length < wordGoal) {
      setShowFail(true)
      setTxt('')
      setTimeout(() => {
        setDisableInput(false)
      }, 1500)
    } else {
      setHeader('Your Text Has Been Saved')
      setBody('You completed your word goal. You can now download your text')
      setShowToast(true)
      setShowConfetti(true)
      savedRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        setShowConfetti(false)
        setDisableInput(false)
        txtInput.current.focus()
      }, 2500)
      setSavedTxt(savedTxt + txtInput.current.value)
      setTxt('')
    }
  }

  const _handleKeyDown = event => {

    if (!fiveRunning) {
      setFiveRunning(true)
      fiveInterval = setInterval(() => {
        setFiveTimer(t => {
          if (t - 1 === 1) {
            setTimeout(() => {
              audio?.play()

            }, 200)
          }
          if (t - 1 === 0) {
            clearEverything()

            console.log('You Did It')
          }
          return t - 1
        })

      }, 1000)
    }

    setTimer(timer => {


      // console.log(message);
      if (!timerRunning && timerInterval === null) {
        setTimerRunning(true)

        timerInterval = setInterval(() => {

          setTimer(timer => {

            if (timer - 1 === -1) {
              const firstWord = txtInput.current.value.indexOf(' ')
              setHeader('Word Deleted')
              setBody('Keep Typing!')
              setShowToast(true)
              setTxt(txt => txtInput.current.value.slice(firstWord + 1, txtInput.current.value.length))

              return 10

            }
            return timer - 1
          })

        }, 1000)
      }

      return 10

    })

    if (event.key === 'Backspace') {
      // 👇️ your logic here
      const firstWord = txt.indexOf(' ')
      console.log(firstWord)
      setHeader('Word Deleted')
      setBody('You hit Backspace and we took a word as payment!')
      setShowToast(true)
      setTxt(txt => txt.slice(firstWord + 1, txt.length))
    }

  };

  function _copy() {
    navigator.clipboard.writeText(savedTxt)
    setHeader('Your Text Copied')
    setBody('Good Job meeting your word goal!')
    setShowToast(true)
  }

  function _download() {
    const date = new Date()
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(savedTxt));
    element.setAttribute('download', `Master-Piece ${(date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()}.txt`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (

    <Container className='bg-dark  p-5 ' style={{ overFlowY: 'scroll' }} fluid>
      <h1 className='text-white text-center font-weight-bold'>Writers Block<sup className="animate__animated animate__bounceInRight">2</sup></h1>
      <p className='text-white text-center my-0'><small>Block the Block</small></p>
      <hr className='text-white' />
      <Row className='bg-dark'>
        <Col md={3} className='text-white animate__animated animate__fadeIn animate__delay-1s'>
          <h2>Rules</h2>
          <ol>
            <li>No hitting the backspace. Doing so will remove the first word from the start of your masterpiece as a penalty. Fix typos later!</li>
            <hr className='text-white' />
            <li >If you stop typing for <strong>10 seconds,</strong> the first word from the start of your block will be removed. </li>
            <hr className='text-white' />
            <li >If you <strong>DON'T</strong> hit your word goal within 5 minutes, all your text will be lost.</li>
            <hr className='text-white' />
            <li >If you <strong>DO</strong> hit your word goal within 5 minutes, you're progress will be saved and will be available for download.</li>
            <hr className='text-white' />
            <li >Start Typing to Get Started</li>
          </ol>
        </Col>
        <Col md={6} className='p-4 h-100 animate__animated animate__fadeIn animate__delay-1s' >
          {savedTxt !== '' && <div style={{ height: window.innerHeight / 2 - 150, overflowY: 'scroll' }}>

            <p className='text-white' dangerouslySetInnerHTML={{ __html: savedTxt.replace(/\n/g, "<br />") }} />
            <AlwaysScrollToBottom />
          </div>}
          <div style={{ height: window.innerHeight / 2 - 150, overflowY: 'scroll' }}>
            <Form.Control
              disabled={disableInput}
              ref={txtInput}
              className='bg-dark text-white b-0 border-dark h-100'
              as="textarea"
              value={txt}
              onKeyDown={_handleKeyDown}
              onChange={e => setTxt(e.target.value)}
              placeholder="Start Typing To Begin..."
              onCopy={e => navigator.clipboard.writeText('')}
              onPaste={e => false}
              onDrop={e => false}
              onCut={e => navigator.clipboard.writeText('')} />
          </div>
        </Col>
        <Col md={3} className='text-white animate__animated animate__fadeIn animate__delay-1s'>
          <h2 className='display-4 mb-0'>{Math.floor(fiveTimer / 60)}:{fiveTimer % 60 < 10 && '0'}{fiveTimer % 60} </h2>
          <p className='mt-0'>Time Left In Session</p>

          <hr className='text-white' />

          {!fiveRunning && <h3><strong>{wordGoal}</strong> Words in 5 Minutes</h3>}
          {fiveRunning && <h3><strong>{txt.trim().split(/\s+/).length}/{wordGoal}</strong> Words in 5 Minutes</h3>}

          <Form.Range disabled={fiveRunning} value={wordGoal} min={100} max={400} step={5} onChange={e => setWordGoal(Number(e.target.value))} />

          <hr className='text-white' />
          <p className='display-4 mb-0'>{timer} <small>Seconds</small></p>
          <p className='mt-0'>Until Word Deletion</p>

          <hr className='text-white' />

          {savedTxt !== '' && <div className='text-center'>
            <Button className='border-white bg-white text-black icon-label' onClick={_download}>Download Saved Text <FaDownload className='ms-2' /></Button>
            <br />
            <Button className='border-white bg-white text-black mt-3 ' onClick={_copy}>Copy Saved Text <FaCopy className='ms-2' /></Button>

          </div>}



        </Col>
      </Row>

      <p className='text-white text-center my-0'><small><em>(Your Text NEVER Leaves Your Browser)</em></small></p>


      {showConfetti && <Confetti
        gravity={1}
        width={window.innerWidth}
        height={window.innerHeight}
      />}

      <Modal show={showFail} onHide={() => setShowFail(false)} centered>

        <Modal.Body className='bg-dark'>
          <div className='p-3 text-center text-white bg-dark'>
            <FaFrown size='9rem' />
            <h2 className='mt-3'>Your Masterpiece Has Been Deleted.</h2>
            <p>We're sorry we had to do that, but you didn't meet your word goal. Try again.</p>
            <Button variant='link text-white' onClick={() => setShowFail(false)}>Close</Button>

          </div>

        </Modal.Body>

      </Modal>


      <ToastContainer className="p-3" position={'bottom-end'} >
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header closeButton={false} >
            {header}
          </Toast.Header>
          <Toast.Body>{body}</Toast.Body>
        </Toast>
      </ToastContainer>

      <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="tylerthecc" data-description="Support me on Buy me a coffee!" data-message="Love this free tool? Share some love" data-color="#ff813f" data-position="Right" data-x_margin="18" data-y_margin="18"></script>

    </Container>

  );



}



export default App;
