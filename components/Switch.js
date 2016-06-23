import React from 'react'

class Switch extends React.Component{
  constructor(props){
    super(props)
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(e){
    const {press} = this.props
    press(e.target.checked)
  }

  render(){
    return(
      <label className="switch">
        <input type="checkbox" onChange={(e) => this.onToggle(e)}/>
        <div className="slider"></div>
      </label>
    )
  }
}

export default Switch
