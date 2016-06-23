import React from 'react'
import classNames from 'classnames'

class CountDisplay extends React.Component {
  constructor(props) {
    super(props)
  }

  render(){
    const {on, step} = this.props
    let ledClass = classNames({
      'led-on': on,
      'led-off': !on
    });

    let displayStep = step === 0 ? '--' : step
    displayStep = displayStep < 10 ? '0' + displayStep : displayStep

    return (
      <div className="count-box">
        <div className="count-screen">
          <span className={ledClass}>{displayStep}</span>
        </div>
        <h5>COUNT</h5>
      </div>
    )
  }
}

export default CountDisplay
