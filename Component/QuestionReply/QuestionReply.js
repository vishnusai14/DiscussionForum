import React, { Component } from "react"
import classes from "./QuestionReply.module.css"
import { withRouter } from "react-router-dom"
import Error from "../Error/Error"
// import img from "./logo.png"
import axios from "axios"
class QuestionReply extends Component{

    state = {
        user : {
            value : "",
            validation : {
                required : true,
                minLength : 5,
                maxLength  : 15
            },
            valid : false,
            classNames : [
                classes.inputField
            ]
        },
        reply : {
            validation : {
                required : true,
                minLength : 15,
                maxLength : 200
            },
            value : "",
            classNames : [classes.replyField],
            valid : false
        },
        formValid : false,
        error : false
    }



    // userHandler = (event) => {
    //     let isValid = true;
    //     if(this.state.user.validation.required){
    //         isValid = event.target.value !== "" && isValid 
            
    //     }
        
    //     if(this.state.user.validation.minLength){
           
    //         isValid = event.target.value.length > this.state.user.validation.minLength && isValid
       
    //     }
    //     if(this.state.user.validation.maxLength){
    //         isValid = event.target.value.length < this.state.user.validation.maxLength && isValid
      
    //     }

    //     let classNames = []
    //     if(!isValid){
    //         classNames.push(classes.notValid)
    //         classNames.push(classes.inputField)
    //     }else{
    //         classNames.push(classes.inputField)
    //     }

    //     let formValid = this.state.user.valid && this.state.reply.valid

    //     this.setState(prevState => ({
    //         user : {
    //             ...prevState.user,
    //             value : event.target.value,
    //             valid : isValid,
    //             classNames : classNames
    //         },
    //        reply : {
    //             ...prevState.reply
    //        },
    //         formValid : formValid
    //     }))
    // }



    replyCheckHandler = (event) => {
        let isValid = true;
        if(this.state.reply.validation.required){
            isValid = event.target.value !== "" && isValid  
        }
        
        if(this.state.reply.validation.minLength){
           
            isValid = event.target.value.length > this.state.reply.validation.minLength && isValid
       
        }
        if(this.state.reply.validation.maxLength){
            isValid = event.target.value.length < this.state.reply.validation.maxLength && isValid
      
        }
        let classNames = []
        if(!isValid){
            classNames.push(classes.notValid)
            classNames.push(classes.replyField)
        }else{
            classNames.push(classes.replyField)
        }
        let formValid = this.state.reply.valid
        this.setState(prevState => ({
            user :{
                ...prevState.user
            },
            reply : {
                ...prevState.reply,
                value : event.target.value,
                valid : isValid,
                classNames : classNames
            },
            formValid : formValid
        }))
    }
    

     replyHandler = (event) => {
       let reply = {
           token : localStorage.getItem('SSUID'),
           id : this.props.qid,
           replymsg : this.state.reply.value,
           date : Date().slice(4,24)
       } 
       axios.post("/update" , reply)
       .then((response) => {
           window.location.reload()  
       })
       .catch((err) => {
        this.setState(prevState => ({
            ...prevState,
            error : true
        }))
       })
       if (Notification.permission === "granted") {
           
           let notification = new Notification("New Answer" , {body : "A Question Has Been Answerd", icon : "https://www.epw.in/system/files/styles/di_top_650x400/private/xdiscussion.png,qitok=99DYtgrh.pagespeed.ic.3R1EmxajlE.webp"} )
            notification.addEventListener("click" , (event) => {
                window.open("https://discussion-forums.herokuapp.com//showblog")
            })
        }
    }

    render (){
        let disable = this.state.formValid
    
    return(
        
       <>
        {this.state.error ? <Error/> :  <div className = {classes.container}>            
            <textarea placeholder = "Enter Your Name" className = {this.state.reply.classNames.join(" ")} onChange = {(event) => {this.replyCheckHandler(event)}} rows = "10" cols = "30"></textarea>
            <button disabled = {!disable} value = {this.props.qid} onClick = {(event) => {this.replyHandler(event)}}>Post</button>
            <button onClick = {this.props.onClickCancel}>Cancel</button> </div> }
         </>   
       
    )
    }
}

export default withRouter(QuestionReply)