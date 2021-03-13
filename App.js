import React, { Component } from "react"
import './App.css';
import Navigator from  "../Component/Navigator/Navigator"
import Blog from "../Component/CreateBlog/CreateBlog"
import ShowBlog from "../Component/ShowBlog/ShowBlog.js"
import Auth from "../Component/Auth/Auth"
import Logout from "../Component/logout/logout"
import MyQuestion from "../Component/myQuestions/myQuestions"
import { Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"
class App extends Component {
    render() {
        return (
                <>
                <Navigator isAuth = {this.props.token || localStorage.getItem('SSUID')}/>
                {this.props.token ? <Redirect to = "/blog"  /> : null}
                <Route  path = "/blog" component = {Blog}/>
                <Route exact path = "/" component = {Auth}/>
                <Route exact path = "/logout" component = {Logout}/>
                <Route exact path= "/showblog"  component = {ShowBlog} />
                <Route exact path = "/showMyQuestion" component = {MyQuestion} />
                </>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        token  : state.token
    }
}

export default connect(mapStateToProps)(App);