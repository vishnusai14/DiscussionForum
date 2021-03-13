import React, { Component } from "react"
import axios from "axios"
import BlogQuestion from "../ShowBlog/BlogQuestion/BlogQuestion"
import Spinner from "../Spinner/Spinner"
class MyQuestion extends Component {
    state = {
        questions : [],
        isAuth : false,
        loading : true
    }

    componentDidMount = ()  => {
       
        let data = {
            token : this.props.token || localStorage.getItem('SSUID')
        }
      
        axios.post("/check" , data)
        .then((response) => {
           
            if(response.data){
                this.getEvent()
                localStorage.setItem('SSUID' , data.token)
                this.setState(prevState => ({
                    ...prevState,
                    isAuth : true,
                    loading : false

                }))
            }else{
                this.setState(prevState => ({
                    ...prevState,
                    loading : false

                }))
            }
        })
        .catch((err) => {
           
            this.setState(prevState => ({
                ...prevState,
                error : err.response.data.error,
                loading : false
            }))
        })
    }

    getEvent = () => {
        let data = {
            token : this.props.token || localStorage.getItem('SSUID')
        }
        axios.post("/showunique" , data)
        .then((response) => {
           
            this.setState(prevState => ({
                ...prevState,
                questions : response.data,
                loading : false
            }))
        })
        .catch((err) => {
            this.setState(prevState => ({
                ...prevState,
                error : true,
                loading : false
            }))
        })
    }


    render () { 
        return (
            <div>
            
            {this.state.loading ? <Spinner /> :
            this.state.isAuth ?  
            this.state.questions.map((q) => {
                return (
                    <BlogQuestion displaybtn = {false} key = {Math.random()} user = {q.userName} question = {q.question} reply = {q.reply} date = {q.date} onClickReply = {(event) => {this.onClickReply(event, q._id)}} qid = {q._id}/>
                   
                )
            }) : <h1>Not Auth</h1>}
            </div>
        )
    }
}

export default MyQuestion