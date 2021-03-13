import React, { Component } from "react"
import QuestionReply from "../QuestionReply/QuestionReply"
import BlogQuestion from "./BlogQuestion/BlogQuestion"
import classes from "./ShowBlog.module.css"
import Spinner from "../Spinner/Spinner"
import Error from "../Error/Error"
import axios from "axios"
class ShowBlog extends Component {

    state = {
        questions : [],
        replying : {
            isReplying : false,
            questionid : ""
        },
        loading : true,
        error : false,
        isAuth : false
    }

    componentDidMount () {
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
        axios.get("/show")
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

    onClickReply = (event, id) => {
        event.preventDefault()
        this.setState(prevState => ({
           ...prevState,
           replying : {
               ...prevState.replying,
               isReplying : true,
               questionid : id
           }
        }))
        
    }
    onClickCancel = (event) => {
        event.preventDefault()
        this.setState(prevState => ({
           ...prevState,
           replying : {
               ...prevState.replying,
               isReplying : false,
               questionid : ""
           }
        }))
       
    }
    postSuccessHanlder = () => {
        this.setState(prevState => ({
            ...prevState ,
            replying : {
                ...prevState.replying ,
                isReplying : false
            }
        }))
    }
    render(){
        let stateCopy = [...this.state.questions]
       
        let reverseQuestion = stateCopy.reverse()
        return(

            <div  className = {classes.wrapper}>
            {this.state.loading ? <Spinner/> :  
            this.state.error ? <Error/> : !this.state.isAuth ? <h1>Not Auth</h1> :   this.state.replying.isReplying ?   <QuestionReply onSuccess = {() => {this.postSuccessHanlder()}} questions = {this.state.questions} qid = {this.state.replying.questionid}  onClickCancel = {(event) => {this.onClickCancel(event)}} /> : reverseQuestion.map((q) => {
                return (
                    <BlogQuestion displaybtn = {true}  key = {Math.random()} user = {q.userName} question = {q.question} reply = {q.reply} date = {q.date} onClickReply = {(event) => {this.onClickReply(event, q._id)}} qid = {q._id}/>
                
                )
               
            
        }) 
            
    }
           
        
        </div>
        )
                   
        
    }
}

export default ShowBlog