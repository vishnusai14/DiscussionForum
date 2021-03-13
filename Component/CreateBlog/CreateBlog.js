import React , { Component } from "react"
import classes from "./CreateBlog.module.css"
import axios from "axios"
import Spinner from "../Spinner/Spinner"
import Error from "../Error/Error"
import { connect } from "react-redux"
import Logout from "../logout/logout"
class Blog extends Component {
    state = {

        userName : "",
        blog : {
            value : "",
            validation : {
                required : true,
                minLength : 5,
                maxLength : 200
            },
            valid : false,
            classNames : [
                classes.inputField
            ]
        },
        formValid : false,
        error : false,
        isAuth : false,
       
    }



    componentDidMount = () => {
        let data = {
            token : this.props.token || localStorage.getItem('SSUID')
        }
       
        axios.post("/check" , data)
        .then((response) => {
          
            if(response.data){
              
                localStorage.setItem('SSUID' , data.token)
                this.setState(prevState => ({
                    ...prevState,
                    userName : response.data,
                    
                    isAuth : true,

                }))
            }
           
        })
        .catch((err) => {
            this.setState(prevState => ({
                ...prevState,
                error : err.response.data.error
            }))
        })
    }

    

    blogHandler = (event) => {
        let isValid = true;
        if(this.state.blog.validation.required){
            isValid = event.target.value !== "" && isValid 
            
        }
        
        if(this.state.blog.validation.minLength){
           
            isValid = event.target.value.length > this.state.blog.validation.minLength && isValid
       
        }
        if(this.state.blog.validation.maxLength){
            isValid = event.target.value.length < this.state.blog.validation.maxLength && isValid
      
        }
        let classNames = []
        if(!isValid){
            classNames.push(classes.notValid)
            classNames.push(classes.inputField)
        }else{
            classNames.push(classes.inputField)
        }
        let formValid = this.state.blog.valid 
        this.setState(prevState => ({
            title : {
                ...prevState.title
            },
            blog : {
                ...prevState.blog,
                value : event.target.value,
                valid : isValid,
                classNames : classNames
            },
            formValid : formValid
        }))
    }
    
    submitHandler = async (event) => {
        event.preventDefault()
      
        let data = {
            token : localStorage.getItem('SSUID'),
            question : this.state.blog.value,
            date : Date().slice(4,24),
            reply : [{msg : "Your Answer Will Display Here" , user : "BOT" , date : ''}] 
        }
       
        axios.post("/create" , data)
        .then((response) => {
            if(response.data === "Ok"){
                this.props.history.push("/showblog")
                window.location.reload()
                
            }
        }).catch((err) => {
            this.setState(prevState => ({
                ...prevState,
                error : true
            }))
        })
    }

    showBlog = () => {
        this.props.history.push("/showblog")
    }


    render () {
    
       
        let disable = this.state.formValid
        return (<>
            <h1>Hello ,  {this.state.userName}<i style  = {{marginLeft : "10px"}} class="fas fa-user"></i></h1>
            <div className = {classes.blogForm}>
              
            {this.props.loading ? <Spinner/> : 
            <>
            <button onClick = {() => {this.showBlog()}}> Show Blog</button>
            <>
          
            {this.state.isAuth ?  this.state.error ? <Error/> : <form onSubmit = {(event) => {this.submitHandler(event)}} className = {classes.blogField}>
                <textarea  cols = "20" className = {this.state.blog.classNames.join(" ")} placeholder = "Enter Your Question" value = {this.state.blog.value} onChange = {(event) => {this.blogHandler(event)}}></textarea>
                <button disabled = {!disable} className = {classes.submit} type = "submit">Create.</button>
            </form> : <><h1>Not Auth</h1></>  } </>
            <Logout msg = {this.state.isAuth ? "Logout" : "Back"} />
            <button onClick = {() => {this.props.history.push("/showMyQuestion")}}  style = {{"margin" : "10px"}}>My Question </button>
            </>
            
        }
            </div>
            </>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        token : state.token,
        serverError : state.error,
        loading : state.isLoading
    }
}


export default connect(mapStateToProps)(Blog)