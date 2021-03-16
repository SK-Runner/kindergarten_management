<template>
    <div id="home">
        <el-container>
            <el-header>
                <div class="logo">
                    <img src="https://i.loli.net/2021/02/19/29L5tVKyoWZPbjm.png" alt="">
                </div>
                <div class="welcome">
                    <div class="username" @click="editInfoShow">欢迎您：{{this.username}}&nbsp;&nbsp;∨</div>
                    <div class="logout" @click="logout">
                        <img src="~assets/logout.svg" alt="">
                        退出
                    </div>
                </div>
                <div class="edit-info" v-show="editInfo" @click="openEditor">编辑个人信息</div>
            </el-header>
            <el-container>
                <el-aside>
                    <asidecontainer></asidecontainer>
                </el-aside>
                <el-main>
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </el-main>
            </el-container>
            <el-footer>版权所有 内蒙古工业大学苏昆毕业设计原创</el-footer>
        </el-container>
        <div>
            <el-dialog title="修改密码" :visible.sync="dialogFormVisible"  :modal-append-to-body="false">
            <el-form :model="form">
                <el-form-item label="用户ID" :label-width="formLabelWidth">
                <el-input v-model="form.userid" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth">
                <el-input v-model="form.confirmPwd" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="ModifyPassword">确 定</el-button>
            </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import asidecontainer from './components/content/aside/asideContainer'
import{
    updatePwd
} from './network/home'
export default {
    name:'home',
    data(){
        return {
            editInfo:false,
            username:'',
            userid:0,
            password:'',
            dialogFormVisible:false,
            formLabelWidth:'120px',
            form:{
                username:'',
                userid:0,
                password:'',
                confirmPwd:''
            }
        }
    },
    components:{
        asidecontainer
    },
    created(){
        // 判断是否登录，如果登录则可以正常进入主页，否则跳转到登录页面
        if(JSON.parse(sessionStorage.getItem('userInfo'))==null){
            alert("请先登录")
            window.location.href = '/login'
        }
        else{
            console.log('userInfo:',JSON.parse(sessionStorage.getItem('userInfo')));
            console.log('token:',JSON.parse(sessionStorage.getItem('token')));
            console.log('permissions:',JSON.parse(sessionStorage.getItem('permissions')));
            this.username = JSON.parse(sessionStorage.getItem('userInfo')).username;
            this.userid = JSON.parse(sessionStorage.getItem('userInfo')).userid;
            this.password = JSON.parse(sessionStorage.getItem('userInfo')).password;
        }

        
 
    },
    methods:{
        editInfoShow(){
            this.editInfo = !this.editInfo
        },
        
        openEditor(){
            this.form.userid = this.userid
            this.form.username = this.username
            this.dialogFormVisible = true
        },
        logout(){
            sessionStorage.removeItem('userInfo')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('permissions')
            alert("用户退出")
            window.location.href = '/login'
        },
        ModifyPassword(){
            if(this.form.password==this.form.confirmPwd){
                let data = {
                    userid:this.form.userid,
                    password:this.form.password
                }
                updatePwd(data).then(res=>{
                    if(res.data.code==200){
                        this.$confirm('修改成功,请重新登陆！').then(() => {
                            this.logout()
                        })
                    }
                })
            }
            else{
                this.$message.error('两次密码输入不正确，请确认！');
            }
        }
    }
}
</script>

<style scoped>
#home{
    position: fixed;
    background-image: url('./assets/homebg.jpg');
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
}

.el-header{
    background-color: rgba(255, 255, 255, 0);
    height: 12vh !important;
}
.logo{
    position: absolute;
    left: 40px;
    top: 15px;
}
.logo img{
    width: 300px;
    height: 73px;
}
.welcome{
    width: 295px;
    height: 35px;
    position: absolute;
    right: 40px;
    top: 48px;
    display: flex;
}
.welcome div{
    border: 1px solid #BBBBBB;

    height: 35px;
    display: inline-block;
    color: #F9F3F3;
    flex: auto;
    text-align: center;
    line-height: 31px;
    cursor: pointer;
}
.welcome .username{
    width: 160px;
}
.welcome .logout{
    border-radius: 10px;
    width: 100px;
    margin-left: 35px;
    border: 1px solid #BBBBBB;
    border-radius: 10px;
}
.welcome .logout img{
    width: 20px;
    /* 图片和字符串在一起时，默认字符串居于图片右下角，需要设置vertical-align为middle */
    vertical-align:middle;
    margin-top: -2px;
}
.edit-info{
    background-color: rgba(246, 246, 246, 0.8);
    font-size: 14px;
    width: 160px;
    height: 30px;
    position: absolute;
    color: #727171;
    border: 1px solid white;
    border-radius: 2px;
    text-align: center;
    line-height: 31px;
    cursor: pointer;
    right: 175px;
    top: 84px;
    border-top: none;
    z-index: 999;
}

.el-aside {
    background-color: rgba(0, 0, 0, 0);
    color: #333;
    text-align: center;
    height: 82vh !important;
    width: 15vw !important;
    display: inline-block !important;
}
  
.el-main {
    position: relative;
    background-color: rgba(245, 245, 245, 1);
    color: #333;
    text-align: center;
    height: 82vh !important;
    width: 85vw !important;
    display: inline-block !important;
    float: right;
    padding: 0 !important;
}

.el-footer {
    background-color: rgba(255, 255, 255, 0);
    height: 6vh !important;
    text-align: center;
    color: white;
    line-height: 6.25vh;
}
  
@import url("./assets/css/base.css");
</style>