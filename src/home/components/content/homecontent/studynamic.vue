<template>
    <div class="studynamic">
        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/24/YsyelpVoX9a2HqT.png" alt="">
                <span>园里动态</span>
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
        </div>

        <el-dialog :visible.sync="dynaDialogVisible" :modal-append-to-body="false">
            <img width="50%" :src="dynaDialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import {
    queryDyna
} from '../../../network/home'
export default {
    name:'studynamic',
    data(){
        return{
            dialogImageUrl: '',
            dialogVisible: false,

            dynaDialogVisible:false,
            dynaDialogImageUrl:'',

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
    methods:{
        dynaDialogshow(pic){
            this.dynaDialogImageUrl = pic
            this.dynaDialogVisible = true
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
    .studynamic{
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