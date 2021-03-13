import React, { Component } from "react"
import classes from "./checkEmail.module.css"
import { connect } from "react-redux"
import * as actionTypes from "../../store/creators/authCreators"
class CheckEmail extends Component {
    state = {
        value : ""
    }

    onChangefiled = (event) => {
        this.setState(prevState => ({
            value : event.target.value
        }))
    }

    click = (event) => {
        this.props.otpVerify(event,this.state.value)
    }

  render() {
    return (
        <>
        <div className = {classes.authForm}>
        <p>An OTP Has Been Sent To Your EMAIL</p>
         <input className = {classes.inputField}  onChange = {(event) => {this.onChangefiled(event)} } value = {this.state.value} type = "number" placeholder = "Enter Your OTP" autoComplete = "false" />
         <button onClick = {(event) => {this.click(event)}}>Submit</button>
         </div> 
         {this.props.error}
       </>
    )
  }
    
}


const mapStateToProps = (state) => {
    return {
        error : state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        otpVerify : (event, otp) => {dispatch(actionTypes.otpverify(event,otp))}
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(CheckEmail)