import React from "react"
import classes from "./BlogReply.module.css"
const Reply = (props) => {
    return (
        <>
        <p>{props.user}</p>
        <p className = {classes.reply}>{props.reply} </p>
        <p>{props.replyDate}</p>
        </>
    )
}

export default Reply