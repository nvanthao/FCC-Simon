import React from 'react'
import classNames from 'classnames'

class StrictButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          onLED: false
        }

        this.onClickLight = this.onClickLight.bind(this)
    }

    onClickLight(){
      let {onLED} = this.state
      const {press, on} = this.props

      //do nothing if game not turned on
      if(!on){
        return
      }

      //on|off Strict Mode
      this.setState({
        onLED: !onLED
      })
      press(!onLED)
    }

    render() {
      let {onLED} = this.state
      const {on} = this.props

      if(!on){
        onLED = false
      }

      let lightClass = classNames({
        'led': true,
        'on': onLED
      })
      return(
        <div className="button-box">
          <div className={lightClass}></div>
          <div className="light-button yellow" onClick={() => this.onClickLight()}></div>
          <h5>Strict</h5>
        </div>
      )
    }
}

export default StrictButton
