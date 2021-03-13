const intialState = {
    token : null,
    userId : null,
    isLoading : false,
    error : null,
    otpCheck : false,
    otp : null
}

const reducer = (state = intialState , action) => {
    if(action.type === 'AUTH_OTP') {
        return {
            ...state,
            otpCheck : true,
            otp : action.otp,
            isLoading : false,
            token : action.token,
            error : null
        }
    }

    if(action.type === 'AUTH_START'){
     
        return {
            ...state,
            isLoading : true,
            error : null
        }
        
    }
  

    if(action.type === 'AUTH_SUCCESS'){
        return {
            ...state,
            isLoading: false,
            token : action.token,
            userId : action.userId
        }
    }
 
    if(action.type === 'AUTH_FAIL'){
        return {
            ...state,
            isLoading : false,
            token : null,
            error : action.error,
            userId: null
        }
    }

    return state
}

export default reducer