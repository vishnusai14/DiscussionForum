import React from "react"
import BlogReply from "../BlogReply/BlogReply"
import classes from "./BlogQuestion.module.css"
const Question = (props) => {
    return (
        <div className = {classes.container}>
        <h3>{props.user}</h3>
        <h2>{props.question}</h2>
        <p>{props.date}</p>
        <button className = {props.displaybtn ? "" : classes.myquestion} value = {props.qid} onClick = {props.onClickReply}>Reply</button>
        {props.reply ? props.reply.map((re) => {
            return <BlogReply replyDate = {re.date}  key = {Math.random()} reply = {re.msg} user = {re.user}/>
        }) : null }
        
        </div>
    )
}

export default Question