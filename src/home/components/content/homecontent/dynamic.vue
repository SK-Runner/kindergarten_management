<template>
    <div class="dynamic">
        <div class="head">
            <div class="formtitle" @click="dynamicRefrush">
                <img src="https://i.loli.net/2021/02/24/YsyelpVoX9a2HqT.png" alt="">
                <span>学校动态</span>
            </div>
        </div>
        <div class="editor-dynamic">
            <el-input
                type="textarea"
                placeholder="分享学校生活......"
                v-model="text"
                maxlength="1024"
                show-word-limit
                :rows="5"
                style="border:none;display: inline-block;"
                >
            </el-input>
            <div>
                <el-upload
                    ref="uploadImg"
                    action="http://localhost:8989/dynamic/uploadimg"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="successload"
                    :before-upload="beforeAvatarUpload"
                    :limit="9"
                    multiple
                    style="margin-top: 10px; display: inline-block; position: relative;">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                    <img width="50%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>
            <div>
                <el-button type="danger" round style="float:right;margin-right:12px" @click="releaseDyna" v-show="text!=''||picStr!=''">提交</el-button>
                <div class="clear"></div>
            </div>
        </div>

        <div class="dynamic-container" v-for="(item,index) in content" :key="index">
            <div class="dynamic-title">
                <span class="tea">{{item.teachername}}</span><br><br>
                <span class="time">
                    <img src="https://i.loli.net/2021/02/26/kUn74lsdrwe2af9.png" alt="" width="48px">
                    {{item.releasedate}} 发布
                </span>
            </div>
            <div class="dynamic-text">{{item.text}}</div>
            <!-- 
                style="width:100%; height:100%; object-fit: cover;" 实现等比例缩略图
                object-fit: cover：对图片进行剪切，保留原始比例：
             -->
            <div class="dynamic-pic">
                <ul>
                    <li v-for="(pic,index) in item.picArr" :key="index">
                        <img :src="pic" alt="" @click="dynaDialogshow(pic)" style="width:100%; height:100%; object-fit: cover;">
                    </li>
                </ul>
            </div>
            <div>
                <el-button type="text" round 
                style="float:right;margin-right:12px" 
                v-show="item.teachername==teachername && item.classid==classid"
                @click="deleteDynamic(item.dynamicid)">删除</el-button>
                <div class="clear"></div>
            </div>
        </div>

        <el-dialog :visible.sync="dynaDialogVisible" :modal-append-to-body="false">
            <img width="50%" :src="dynaDialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import {
    dynamicRelease,
    deletePic,
    queryDyna,
    delDyna
} from '../../../network/home'
export default {
    name:'dynamic',
    data(){
        return{
            dialogImageUrl: '',
            dialogVisible: false,

            dynaDialogVisible:false,
            dynaDialogImageUrl:'',

            text:'',
            teachername:JSON.parse(sessionStorage.getItem('userInfo')).username,
            classid:1,
            picStr:'',
            releasedate:'',

            picArr:[],

            content:[
            ],

            pagesize:10,
            pagenum:1
            
        }
    },
    mounted(){
        let data = {
            pagesize:parseInt(this.pagesize),
            pagenum:parseInt(this.pagenum)
        }
        queryDyna(data).then(res=>{
            let arr = res.data.content
            console.log('res.data.content：',res.data.content);
            this.content = arr
            for(let i=0 ; i< arr.length ; i++){
                this.content[i].picArr = arr[i].url.split(',')
                this.content[i].picArr.pop()
            }
            console.log('this.content：',this.content);
        })
    },
    computed:{
    },
    methods:{
        // 移除上传的图片，并且请求删除本地文件
        handleRemove() {
            console.log('delete');
            let data={
                picStr:this.picStr,
            }
            deletePic(data).then(res=>{
                this.picStr = ''
                console.log('res：',res);
            })
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        successload(res){
            console.log("url:",res);
            this.picStr += res+","
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        releaseDyna(){
            let time = new Date()
            console.log(time);
            let data = {
                text:this.text,
                teachername:this.teachername,
                classid:this.classid,
                url:this.picStr,
                releasedate:time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
            }
            // console.log('上传动态数据：',data);
            dynamicRelease(data).then(res=>{
                console.log('上传后数据',res);
                this.$refs.uploadImg.clearFiles()
                this.picStr=''
                this.text=''
                this.dynamicRefrush()
            })
        },

        dynaDialogshow(pic){
            this.dynaDialogImageUrl = pic
            this.dynaDialogVisible = true
        },

        deleteDynamic(dynamicid){
            console.log(dynamicid);

            let data = {
                dynamicid:parseInt(dynamicid)
            }

            this.$confirm('此操作将永久删除该动态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delDyna(data).then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.dynamicRefrush()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        dynamicRefrush(){
            let data = {
                pagesize:parseInt(this.pagesize),
                pagenum:parseInt(this.pagenum)
            }
            queryDyna(data).then(res=>{
                let arr = res.data.content
                console.log('res.data.content：',res.data.content);
                this.content = arr
                for(let i=0 ; i< arr.length ; i++){
                    this.content[i].picArr = arr[i].url.split(',')
                    this.content[i].picArr.pop()
                }
                console.log('this.content：',this.content);
            })
        }


    }
}
</script>

<style scoped>
    ul>li{
        list-style: none;
    }
    .dynamic{
        position: relative;
        top: 0;
        width: 100%;
    }
    .head{
        position: relative;
        top: 0;
        height: 65px;
        width: 100%;
        background-color: #F9A101;
        
    }
    .formtitle{
        margin-top: 20px;
        display: inline-block;
        position: absolute;
        left: 2%;
    }
    .formtitle img{
        width: 25px;
        height: 25px;
        vertical-align: middle;
        margin-right: 5px;
        margin-top: -5px;
    }
    .formtitle span{
        font-size: 20px;
        color: #FBF8F8;
    }
    .editor-dynamic{
        width: 834px;
        margin: 0 auto;
        background-color: rgb(255, 255, 255);
        padding: 12px 12px 12px 12px;
        position: relative;
        border-radius: 5px;
    }
    /* 解决float空间塌陷 */
    .clear{
        height: 0;
        width: 0;
        clear:both
    }


    .dynamic-container{
        width: 834px;
        margin: 12px auto;
        background-color: rgb(255, 255, 255);
        padding: 12px 52px 12px 52px;
        position: relative;
        border-radius: 5px;
    }
    .dynamic-title,.dynamic-text{
        text-align: left;
    }
    .dynamic-title{
        margin:8px 0
    }
    .tea{
        font-size: 18px;
        font-weight: 500;
        color: rgb(195, 23, 230);
    }
    .time{
        font-size: 14px;
        color: #999;
        padding-left: 10px;
    }
    .dynamic-text{
        margin:8px 0;
        font-size: 16px;
        color: #20232c;
    }
    .dynamic-pic{
        margin:8px 0
    }
    .dynamic-pic ul{
        display: flex;
        flex-wrap: wrap;
    }
    .dynamic-pic ul li{
        width: 220px;
        height: 220px;
        padding: 5px 5px
    }
</style>