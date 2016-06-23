import React from 'react'

class StartButton extends React.Component {
    constructor(props) {
        super(props)

        this.onClickStart = this.onClickStart.bind(this)
    }

    onClickStart(){
      const {press} = this.props
      press()
    }

    render() {
      return(
        <div className="button-box" onClick={this.onClickStart}>
          <div className="inner-button-box">
            <div className="light-button red"></div>
            <h5>Start</h5>
          </div>
        </div>
      )
    }
}

export default StartButton
