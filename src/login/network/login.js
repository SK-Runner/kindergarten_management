import request from './request'

export function checkIdentify(data){
    return request({
        url:'login',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}