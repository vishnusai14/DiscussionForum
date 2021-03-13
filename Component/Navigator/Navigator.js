import React, { Component } from "react"
import classes from "./Navigator.module.css"
import { Link } from "react-router-dom"
import img from "./logo.png"
class Navigator extends Component  {
    
    render (){
        return (
                <div className = {classes.wrapper}>
                <nav className = {classes.navMain}>
                <ul className = {classes.listGroup}>
                    <li className = {classes.list}>
                        <img className = {classes.image} src = {img} alt = "img"/>
                    </li>
                </ul>
                    <ul  className = {classes.listGroup}>
                    <Link  to = "/">
                        <li className = {classes.list}>
                            Home
                        </li>
                        </Link>
                        <Link  to = "/blog">
                        <li className = {classes.list}>
                          Blogs 
                        </li>
                        </Link>
               
                    </ul>
                    
                </nav>
                </div>        
        )
    }
}




export default Navigator