import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType"

const initialValue = {
    messages:[],
    newMessages:null

}

export const messageReducer = (store=initialValue, {type,payload})=>{
    if(type===CREATE_NEW_MESSAGE){
        return{...store,newMessages:payload}
    }
    else if(type===GET_ALL_MESSAGE){
        return {...store, messages:payload}
    }   
    return store;
}