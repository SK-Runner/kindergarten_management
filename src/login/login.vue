<template>
    <div id="login">
        <div class="logo">
            <img src="https://i.loli.net/2021/02/19/29L5tVKyoWZPbjm.png" alt="logo未加载">
        </div>
        <div class="content">
            <div class="input1">
                <input type="text" class="input-info" placeholder="登录账号" v-model="phone">
                <img src="https://i.loli.net/2021/02/19/BdQsDyCPZSRprXU.png" alt="" class="little-img1">
            </div>
            <div class="input2">
                <input type="password" class="input-info" placeholder="登录密码" v-model="password">
                <img src="https://i.loli.net/2021/02/19/Ak7F3YvbUcIpBqX.png" alt="" class="little-img2">
            </div>
            <div class="input3">
                <input type="password" class="identify-code" placeholder="验证码" v-model="identifyCode">
                <identify @getCode="getCodeFromChildren" ref="identifyCom"></identify>
            </div>
            <p class="errormsg" v-show="showmsg">{{errmsg}}</p>
            <div class="btn" @click="userlogin">
                <button class="login-btn">登录</button>
            </div>

        </div>
    </div>    
</template>
<script>

import identify from './identify.vue'
import {checkIdentify} from './network/login'

export default {
    name:'login',
    data(){
        return {
            'showmsg':false,
            'errmsg':'',
            'phone':'',
            'password':'',
            'identifyCode':'',
            'tempData':'',
        }
    },
    components:{
        identify
    },
    methods:{
        userlogin(){
            let data = {
                'phone':this.phone,
                'password':this.password
            }
            if(this.phone=='' || this.password==''){
                console.log('登录的用户信息为：'+data);
                this.errmsg = '用户名或密码不能为空'
                this.showmsg = true
            }
            else if(this.identifyCode == '' || this.tempData!=this.identifyCode){
                console.log(this.identifyCode,'&&',this.tempData);
                this.errmsg = '验证码错误'
                this.showmsg = true
                this.$refs.identifyCom.refreshCode()
            }
            else{
                console.log('登录的用户信息为：'+data);
                console.log(this.identifyCode,'&&',this.tempData);
                checkIdentify(data).then(res=>{
                    const validData = res.data;
                    console.log('res:',res);
                    console.log('res.data:',validData);
                    if(validData.code==200){
                        this.showmsg = false
                        sessionStorage.setItem('userInfo',JSON.stringify(validData.data.user))
                        sessionStorage.setItem('token',JSON.stringify(validData.data.token))
                        sessionStorage.setItem('permissions',JSON.stringify(validData.data.permissions))
                        alert('登录成功')
                        window.location.href='/home'
                    }
                    else{
                        this.errmsg = '用户名或密码错误'
                        this.showmsg = true
                        this.password=''
                    }
                }).catch(()=>{
                    this.errmsg = '网络错误'
                    this.showmsg = true
                })
            }
        },
        getCodeFromChildren(data){
            this.tempData = data
        },
    }
}
</script>
<style scoped>
    
    #login{
        position: fixed;
        background-image: url('./assets/loginbackground.jpg');
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
    }
    .logo{
        position: relative;
        left: 135px;
        top: 75px;
    }
    .logo img{
        width: 300px;
        height: 70px;
    }
    .content{
        position: relative;
        left: 41%;
        top: 33%;
    }
    .input1,.input2,.input3{
        width: 305px;
        height: 40px;
        position: relative;
    }
    .input-info{
        width: 305px;
        height: 40px;
        padding-left: 10px;
        padding-right: 35px;
        border-radius: 5px;
        border: #F5AD00 1px solid;
    }
    .identify-code{
        width: 205px;
        height: 40px;
        padding-left: 10px;
        border-radius: 5px;
        border: #F5AD00 1px solid;
        float: left;
    }
    .input2{
        margin: 20px 0 15px 0;
    }
    .btn{
        margin-top: 15px;
        /* margin-bottom: 20px; */
    }
    .login-btn{
        width: 305px;
        height: 40px;
        background-color: #F5AD00;
        color: white;
        font-size: 20px;
        border: #F5AD00;
    }
    .little-img1{
        width: 31px;
        height: 31px;
        position: absolute;
        right: 1px;
        top: 3px;
    }
    .little-img2{
        width: 35px;
        height: 35px;
        position: absolute;
        right: 1px;
        top: 2px;
    }
    .errormsg{
        font-size: 16px;
        color: #F20808;
        margin-top: 15px;
    }
    @import url("~assets/css/base.css")
</style>