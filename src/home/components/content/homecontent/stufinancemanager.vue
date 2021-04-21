<template>
    <div class="stufinancemanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>缴费记录表</span>
            </div>
            <div class="condition">
                <el-select v-model="payname" placeholder="缴费名称" class="conditionitem">
                    <el-option label="保教费" value="保教费"></el-option>
                    <el-option label="生活费" value="生活费"></el-option>
                </el-select>
                <el-cascader
                    placeholder="选择季度"
                    v-model="value"
                    :options="options"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"
                    class="conditionitem">
                </el-cascader>
                <el-button class="conditionitem" @click="queryBillByItems">搜索</el-button>
                <el-button type="text" @click="open">查看收费标准</el-button>
            </div>
        </div>

        <div>
            <!-- @row-click="handdle" -->
            <el-table
            :data="dataList"
            style="width: 100%">
                <el-table-column
                    v-for="(item,index) in dataColum"
                    :key="index"
                    :label="item"
                    min-width>
                    <template slot-scope="scope">
                        {{scope.row[index]}}
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="instructionswords">
            <el-alert
                title="班级代码说明"
                type="success"
                description="1:甘露一班; 6:甘露二班; 2:晨曦一班; 7:晨曦二班; 3:朝希一班; 8:朝希二班;">
            </el-alert>
            <el-alert
                title="账号状态代码说明【0：无效；1：有效】"
                type="success">
            </el-alert>
            <el-alert
                title="缴费方式代码说明【0：按学期缴费；1：按月缴费】"
                type="success">
            </el-alert>
        </div>

        <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
                :page-size="pagesize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>

import {
    queryallbill
} from '../../../network/home'

export default {
    name:'stufinancemanager',

    data() {
        return {
            dataColum:{
                payid: '缴费单号',
                studentid: '学生ID',
                studentname: '学生姓名',
                classid: '所属班级',
                payname: '缴费项目名称',
                paytype: '缴费方式',
                absence: '缺席天数',
                units: '价格/(学期/月)',
                num: '数量',
                bookfee: '书本费',
                refee: '退费金额',
                fee: '应缴费用',
                paydate: '缴费时间',
                endate: '到期时间',
                other: '缴费补充说明',
                
            },
            dataList:[],

            studentid: 6,

            classid:'',

            payname: '',

            pagesize:5,

            total:0,

            currentPage1:1,

            formLabelWidth: '120px',

            // 学期的联级选择器数据
            value: [],
            options: [{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },{
                value: '',
                label: '',
                children: [{
                    value: '',
                    label: '',
                },{
                    value: '',
                    label: '',
                },]
            },],
            startime:'',
            endtime:'',

            // 显示收费标准
            showTip: false,
        }
    },
    mounted(){
        // 动态设置学期起始和结束时间
        let now = new Date()
        for(let i = 3,j=0 ; i > -4 ; i--,j++){
            this.options[j].value = now.getFullYear()+i
            this.options[j].label = now.getFullYear()+i
            this.options[j].children[0].value = (this.options[j].value).toString() + '-03' + ' ' + this.options[j].value.toString() + '-08'
            this.options[j].children[0].label = '春季'
            this.options[j].children[1].value = this.options[j].value.toString() + '-09' + ' ' + (this.options[j].value+1).toString() + '-02'
            this.options[j].children[1].label = '秋季'
        }

        // 加载全部数据
        let data = {
            pagenum:this.currentPage1,
            pagesize:this.pagesize,
            studentid:this.studentid
        }
        queryallbill(data).then(res=>{
            let result = res.data
            console.log(res);
            this.total = result.totalSize
            this.dataList = result.content
            console.log('加载全部：',this.dataList);
        })
    },
    methods:{
        // 获取学期开始时间和结束时间
        handleChange(value){
            let timeArr = value[1].split(' ')
            this.startime = timeArr[0]
            this.endtime = timeArr[1]
            console.log(this.startime);
            console.log(this.endtime);
        },
        handleCurrentChange(index){
            console.log(index);
            let data = {
                pagenum:this.index,
                pagesize:this.pagesize,
                studentid:parseInt(this.studentid),
                classid:parseInt(this.classid),
                payname:this.payname,
                startime:this.startime,
                endtime:this.endtime
            }
            queryallbill(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });
        },
        // 条件查询缴费记录
        queryBillByItems(){
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                payname:this.payname,
                startime:this.startime,
                endtime:this.endtime,
                studentid:parseInt(this.studentid)
            }
            queryallbill(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });
        },

        open() {
            let str = `
            <strong>保教费收费标准：</strong>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;按学期缴费，1000元/学期，包含书本费和资料费；
            <br>&nbsp;&nbsp;&nbsp;&nbsp;按月缴费，400元/月，不包含书本费和资料费；
            <br>注：单独购买书本费及资料费：50元
            <br><strong>生活费收费标准：</strong>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;按学期缴费，500元/学期；
            <br>&nbsp;&nbsp;&nbsp;&nbsp;按月缴费，120元/月；
            <br><strong>退费标准：</strong>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;1、按学期缴费退费标准：
            <br>&nbsp;&nbsp;&nbsp;&nbsp;凡入园满20天（含周六、周日），按学期收费；
            <br>&nbsp;&nbsp;&nbsp;&nbsp;凡入园不满20天（含周六、周日），按半学期收费；
            <br>&nbsp;&nbsp;&nbsp;&nbsp;2、按月缴费退费标准：
            <br>&nbsp;&nbsp;&nbsp;&nbsp;凡入园满7天（含周六、周日），按月收费
            <br>&nbsp;&nbsp;&nbsp;&nbsp;凡入园不满7天（含周六、周日），按半月收费
            <br>注：以上收费标准由国家发改委审定批准`
            this.$alert(str, '收费标准', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
            });
        }
    }
}
</script>
<style scoped>
    .classmanager{
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
    .condition{
        margin-top: 10px;
        display: inline-block;
        position: absolute;
        left: 15%;
        height: auto;
    }
    .add-info{
        margin-top: 10px;
        display: inline-block;
        position: absolute;
        right: 2%;
        height: auto;
    }
    .conditionitem{
        margin-right: 18px;
        width: 120px;
    }
    .instructionswords{
        position: absolute;
        left: 0;
        width: 28%;
        display: inline-block;
    }
    .block{
        position: absolute;
        right: 2%;
    }
</style>