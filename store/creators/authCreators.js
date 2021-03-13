import axios from "axios"
import Cookies from "universal-cookie"
import bcrypt from "bcryptjs"
const cookie = new Cookies()
export const authSuccess = (token, userId) => {
    cookie.remove('SSU_KEY_ENC')
    cookie.remove('SSUI_TEMP_KEY')
    return {
        type : 'AUTH_SUCCESS',
        token : token,
        userID: userId
    }
}

export const authFail = (error) => {
    return {
        type : 'AUTH_FAIL',
        error : error
    }
} 


export const authStart = () => {
  
    return {
        type : 'AUTH_START'
    }
}


export const authOtp = (otp) => {
    return {
        type : 'AUTH_OTP',
        otp : otp,
       
    }
}



export const otpverify = (event,otp) => {
    event.preventDefault()
    return (dispatch) => {
            let data = {
                token : cookie.get('SSUI_TEMP_KEY'),
                otp : otp
            }
            axios.post("/checkotp" , data)
            .then((response) => {
                dispatch(authSuccess(response.data))
            })
            .catch((err) => {
                dispatch(authFail(err.response.data.error))
            })
        
    }
   

}

export const auth = (event, email, password, userName, isSignUp) => {
    event.preventDefault()
    return (dispatch) => {
        dispatch(authStart())
        let data = {
            user : userName,
            password : password,
            email : email

        }
       
        if(isSignUp){
            axios.post("/newuser" , data)
            .then((response) => {
                
                dispatch((authOtp(response.data.otp)))
                bcrypt.hash(response.data.otp , 2, (err, hashotp) => {
                    cookie.set('SSU_KEY_ENC' , hashotp)
                    cookie.set('SSUI_TEMP_KEY' , response.data.tokenId)
                })
                
               
            })
            .catch((err) => {
                dispatch((authFail(err.response.data.error)))
            })
        }else{
            axios.post("/checkuser" , data)
            .then((response) => {
              
                dispatch((authSuccess(response.data.tokenId)))
                localStorage.setItem('SSUID' , response.data.tokenId)
            })
            .catch((err) => {
                dispatch(authFail(err.response.data.error))
            })
        }
       
    } 
}

