import request from './request'

// ----------------班级管理----------------
export function queryallcla(data){
    return request({
        url:'check/cla/queryallcla',
        data:data,
        headers:{
            'content-type':'application/json'
        }, 
        method:'post',
        
    })
}

export function insertClass(data){
    return request({
        url:'check/cla/addclass',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function updateClass(data){
    return request({
        url:'check/cla/updateclass',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function deleteClass(data){
    return request({
        url:'check/cla/delclass',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function queryClassById(data){
    return request({
        url:'check/cla/queryClassById',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function queryAllClassName(){
    return request({
        url:'check/cla/queryAllClassName',
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function getstudent(data){
    return request({
        url:'check/cla/getstudent',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------学生管理----------------

export function queryallstu(data){
    return request({
        url:'check/stu/queryallstu',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function insertStudent(data){
    return request({
        url:'check/stu/addstudent',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function updateStudent(data){
    return request({
        url:'check/stu/updstudent',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function deleteStudent(data){
    return request({
        url:'check/stu/delstudent',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------职工管理----------------

export function queryalltea(data){
    return request({
        url:'check/tea/queryalltea',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function insertTeacher(data){
    return request({
        url:'check/tea/addteacher',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function updateTeacher(data){
    return request({
        url:'check/tea/updteacher',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function deleteTeacher(data){
    return request({
        url:'check/tea/delteacher',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------财务管理----------------

export function queryallbill(data){
    return request({
        url:'check/pay/getbilllist',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function insertBill(data){
    return request({
        url:'check/pay/createbill',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

export function updateBill(data){
    return request({
        url:'check/pay/updatebill',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------修改密码----------------
export function updatePwd(data){
    return request({
        url:'check/updatepwd',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------查询假条----------------
export function queryLeave(data){
    return request({
        url:'check/queryleave',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------创建假条----------------
export function createLeave(data){
    return request({
        url:'check/createleave',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------修改假条----------------
export function updateLeave(data){
    return request({
        url:'check/updateleave',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------删除假条----------------
export function delLeave(data){
    return request({
        url:'check/deleteleave',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------教师批准假条----------------
export function permitLeave(data){
    return request({
        url:'check/teapermitleave',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------发布动态----------------
export function dynamicRelease(data){
    return request({
        url:'dynamic/uploaddyna',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------移除图片----------------
export function deletePic(data){
    return request({
        url:'dynamic/deletepic',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------移除图片----------------
export function queryDyna(data){
    return request({
        url:'dynamic/querydyna',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}

// ----------------移除图片----------------
export function delDyna(data){
    return request({
        url:'dynamic/deletedyna',
        data:data,
        headers:{
            'content-type':'application/json'
        },
        method:'post',
        
    })
}