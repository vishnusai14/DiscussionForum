import React, { Component } from "react"
import classes from "./Auth.module.css"
import { connect } from "react-redux"
import * as actionTypes from "../../store/creators/authCreators"
import { withRouter } from "react-router-dom"
import Spinner from "../Spinner/Spinner"
import Check from '../checkemail/checkEmail'
import axios from 'axios'
class Auth extends Component {
    state =  {
        email : {
            value : "",
            validation : {
                isEmail : true,
                required : true,
            },
            isValid : false,
            classNames : [
                classes.inputField
            ]
        },
        password : {
            value : "",
            validation : {
                minLength : 7,
                required : true,
            },
            isValid : false,
            classNames : [
                classes.inputField
            ]
        },
        user : {
            value : "",
            validation : {
                required : true,
            },
            isValid : false,
            classNames : [
                classes.inputField
            ]
        },
        formValid : false,
        isSignUp : true
    }


    componentDidMount = () => {
        Notification.requestPermission().then((res) => {
            console.log(res)
        })
        let token = localStorage.getItem('SSUID')
        if(token) {
            let data = {
                token : token
            }
           
            axios.post("/check" ,data)
            .then((response) => {
               
                this.props.history.push("/blog")
            })
            .catch((err) => {
                
            })
        } 
    }

    emailHandler = (event) => {
        let isValid = true;
        if(this.state.email.validation.required){
            isValid = event.target.value !== "" && isValid 
            
        }
        
        if(this.state.email.validation.minLength){
           
            isValid = event.target.value.length > this.state.user.validation.minLength && isValid
       
        }
        if(this.state.email.validation.maxLength){
            isValid = event.target.value.length < this.state.user.validation.maxLength && isValid
      
        }
        if(this.state.email.validation.isEmail){
            const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            isValid = pattern.test(event.target.value) && isValid
        }

        let classNames = []
        if(!isValid){
            classNames.push(classes.notValid)
            classNames.push(classes.inputField)
        }else{
            classNames.push(classes.inputField)
        }

        let formValid = this.state.email.isValid && this.state.password.isValid && this.state.user.isValid
        this.setState(prevState => ({
            email : {
                ...prevState.user,
                value : event.target.value,
                isValid : isValid,
                classNames : classNames
            },
          user : {
              ...prevState.user
          },
          password : {
              ...prevState.password
          },
            formValid : formValid
        }))

    }




    userHandler = (event) => {
        let isValid = true;
        if(this.state.user.validation.required){
            isValid = event.target.value !== "" && isValid 
            
        }
        
        if(this.state.user.validation.minLength){
           
            isValid = event.target.value.length > this.state.user.validation.minLength && isValid
       
        }
        if(this.state.user.validation.maxLength){
            isValid = event.target.value.length < this.state.user.validation.maxLength && isValid
      
        }
        if(this.state.user.validation.isEmail){
            const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            isValid = pattern.test(event.target.value) && isValid
        }

        let classNames = []
        if(!isValid){
            classNames.push(classes.notValid)
            classNames.push(classes.inputField)
        }else{
            classNames.push(classes.inputField)
        }

        let formValid = this.state.email.isValid && this.state.password.isValid && this.state.user.isValid
        this.setState(prevState => ({
            email : {
                ...prevState.email,
               
            },
          user : {
            ...prevState.user,
            value : event.target.value,
            isValid : isValid,
            classNames : classNames
          },
          password : {
              ...prevState.password
          },
            formValid : formValid
        }))

    }



    passwordHandler = (event) => {
        let isValid = true;
        if(this.state.password.validation.required){
            isValid = event.target.value !== "" && isValid 
            
        }
        
        if(this.state.password.validation.minLength){
           
            isValid = event.target.value.length > this.state.password.validation.minLength && isValid
       
        }
        if(this.state.password.validation.maxLength){
            isValid = event.target.value.length < this.state.password.validation.maxLength && isValid
      
        }
        if(this.state.password.validation.isEmail){
            const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            isValid = pattern.test(event.target.value) && isValid
        }

        let classNames = []
        if(!isValid){
            classNames.push(classes.notValid)
            classNames.push(classes.inputField)
        }else{
            classNames.push(classes.inputField)
        }

        let formValid = this.state.email.isValid && this.state.password.isValid && this.state.user.isValid
        this.setState(prevState => ({
            email : {
                ...prevState.email,
               
            },
          user : {
            ...prevState.user,
          },
          password : { 
              ...prevState.password,
            value : event.target.value,
            isValid : isValid,
            classNames : classNames
          },
            formValid : formValid
        }))
      
    }

    
    switchSignMode = (event) => {
        event.preventDefault()
        this.setState(prevState => ({
            ...prevState,
            user : {
                ...prevState.user
            },
            email : {
                ...prevState.email
            },
            password : {
                ...prevState.password
            },
            isSignUp : !prevState.isSignUp
        }))
    }

    submitHandler = (event) => {
        this.props.auth(event, this.state.email.value, this.state.password.value, this.state.user.value, this.state.isSignUp)
    }

    render() {
      
        let disable = this.state.formValid
        return (
            <>
            {this.props.loading ? <Spinner /> : 
            <>
            {this.props.otpCheck ? <Check /> :
            <> 
            <h1>{this.state.isSignUp ? "SignUp" : "LogIn"}</h1>
           <div className = {classes.authForm}>
           
            <form onSubmit = {(event) => {this.submitHandler(event)}} className = {classes.blogField}>
                <input className = {this.state.email.classNames.join(" ")} type = "email" placeholder = "Enter Your Email" autoComplete = "false" value = {this.state.email.value} onChange = {(event) => {this.emailHandler(event)}} />
                <input className = {this.state.user.classNames.join(" ")} type = "text" placeholder = "Enter Your Name" autoComplete = "false" value = {this.state.user.value} onChange = {(event) => {this.userHandler(event)}} />
                <input type = "password"  className = {this.state.password.classNames.join(" ")} placeholder = "Enter Your Password" autoComplete = "false" value = {this.state.password.value} onChange = {(event) => {this.passwordHandler(event)}}></input>
                <button disabled = {!disable} className = {classes.submit} type = "submit" >{this.state.isSignUp ? "SIGN UP" : "LOG IN"}</button>
                {this.props.error}
            </form>
            <button onClick = {(event) => {this.switchSignMode(event)}}  className = {classes.submit}>Switch To {this.state.isSignUp ? "LogIn" : "SignUp"}</button>
            </div>
            </>
        }
            </>
           
            }
            </>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        error : state.error,
        loading : state.isLoading,
        otpCheck : state.otpCheck
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        auth : (event,email,password,userName,isSignUp) => {dispatch(actionTypes.auth(event,email,password,userName,isSignUp))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth))