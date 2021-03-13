import React, { Component } from "react"
import {withRouter} from "react-router-dom"
import classes from "./logout.module.css"
class Logout extends Component {

  logout = () => {
    localStorage.removeItem('SSUID')
    this.props.history.push("/")
    window.location.reload()
  }

    render() {


        return (
            <button className = {classes.logout} onClick = {() => {this.logout()}}>{this.props.msg}</button>
        )
        
    }
}
export default withRouter(Logout)