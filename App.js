import React from 'react'
import CountDisplay from './components/CountDisplay'
import StartButton from './components/StartButton'
import StrictButton from './components/StrictButton'
import Switch from './components/Switch'
import Tone from './node_modules/tone/build/Tone'
import classNames from 'classnames'

const defaultProps = {
  tlNote: 'E3',
  trNote: 'A4',
  blNote: 'C4',
  brNote: 'E4'
}

class App extends React.Component{
  constructor(props){
    super(props)
    this.synth = new Tone.SimpleSynth().toMaster()

    this.state = {
      on: false,
      strict: false,
      sequence: [],
      clickable: true,
      replayStep: -1, //count from 0
      userStep: 0, //count from 0
      latestStep: 0
    }

    this.handleColor = this.handleColor.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleStrict = this.handleStrict.bind(this)

  }

  componentDidMount(){

    //on mouse up in Simon board, turn off sound if any
    document.getElementById('simon').addEventListener('mouseup',(e) => {
      this.synth.triggerRelease()
    })
  }

  handleColor(note){
    const {on, clickable, userStep, sequence} = this.state
    let nextStep = userStep

    //is the board turned on or lickable?
    if(!on || !clickable ){
      return
    }

    //match?
    console.log('Step:', userStep, 'User:',note,'Actual:',sequence[userStep])
    if(note !== sequence[userStep]){
      this.processError()
      return
    }

    //play sound
    this.synth.triggerAttack(note)

    //terminate?
    if(userStep === 20){
      alert('Victory!')

      //reset game
      this.setState({
        on: false,
        sequence: [],
        replayStep: -1,
        latestStep: 0,
        userStep: 0
      })
      return
    }

    //generate next sound?
    if(nextStep === sequence.length - 1){
      //generate next sound
      let newSeq = this.generateSound(sequence)
      this.play(newSeq)
      nextStep = 0
    }else{
      //update current step
      nextStep++
    }

    this.setState({
      userStep: nextStep
    })

  }

  handleToggle(value){
    this.setState({
      on: value,
      sequence: [],
      replayStep: -1,
      latestStep: 0,
      userStep: 0
    })
  }

  handleStart(){
    let {on, clickable} = this.state

    if(!on || !clickable){
      return
    }

    console.log("Start Game!");

    //start game
    let sequence = this.generateSound([])
    this.play(sequence)

  }

  handleStrict(value){
    const {on, clickable} = this.state

    if(!on && !clickable){
      return
    }

    this.setState({
      strict: value
    })
  }

  generateSound(sequence){
    const {tlNote, trNote, blNote, brNote} = this.props
    const allSound = [tlNote, trNote, blNote, brNote]
    const rand = this.getRandomInt(0, allSound.length - 1)

    sequence.push(allSound[rand])

    this.setState({
      sequence: sequence
    })

    return sequence
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  play(sequence){
    const duration = 1 //second
    let i = 0

    console.log('Playing:',sequence)

    //set not clickable during playing
    this.setState({
      clickable: false
    })

    let id = setInterval(()=>{
      if(i === sequence.length){
        //reset current step & can play now
        this.setState({
          latestStep: i,
          replayStep: -1,
          clickable: true
        })
        clearInterval(id)
      }else{
        this.synth.triggerAttackRelease(sequence[i],duration)
        this.setState({
          replayStep: i
        })
        i++
      }
    },duration * 1000)

  }

  processError(){
    const {sequence, strict} = this.state
    //display error
    //reset user memory
    this.setState({
      latestStep: '!!',
      userStep: 0
    })

    this.synth.triggerAttackRelease('G6') //error sound

    //reset all if strict mode
    if(strict){
        this.handleStart()
        return
    }

    this.play(sequence)
  }

  render(){
    const {on, replayStep, sequence, latestStep} = this.state
    const {tlNote, trNote, blNote, brNote} = this.props

    let topLeftClass = classNames({
      'top-left': true,
      'active': sequence[replayStep] === tlNote
    })
    let topRightClass = classNames({
      'top-right': true,
      'active': sequence[replayStep] === trNote
    })
    let bottomLeftClass = classNames({
      'bottom-left': true,
      'active': sequence[replayStep] === blNote
    })
    let bottomRightClass = classNames({
      'bottom-right': true,
      'active': sequence[replayStep] === brNote
    })

    return(
      <div className="game">
        <div className="simon" id="simon">
          <div className="circle">
            <div id='tl' className={topLeftClass} onMouseDown={() => this.handleColor(tlNote)}></div>
            <div id='tr' className={topRightClass} onMouseDown={() => this.handleColor(trNote)}></div>
            <br/>
            <div id='bl' className={bottomLeftClass} onMouseDown={() => this.handleColor(blNote)}></div>
            <div id='br' className={bottomRightClass} onMouseDown={() => this.handleColor(brNote)}></div>
          </div>
          <div className="board">
            <span className="title">Simon</span>
            <div className="config-box">
              <CountDisplay on={on} step={latestStep}/>
              <StartButton press={this.handleStart}/>
              <StrictButton on={on} press={this.handleStrict}/>
            </div>
            <Switch press={this.handleToggle}/>
          </div>
        </div>
      </div>
        )
    }
}

App.defaultProps = defaultProps

export default App
