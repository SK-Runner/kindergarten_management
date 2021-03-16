<template>
    <div class="paymanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>缴费记录表</span>
            </div>
            <div class="condition">
                <el-input v-model="studentid" placeholder="学生ID" class="conditionitem"></el-input>
                <el-input v-model="classid" placeholder="班级ID" class="conditionitem"></el-input>
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
            </div>
            <div class="add-info">
                <el-button class="conditionitem" @click="insertDialogFormVisibleControl">添加缴费记录</el-button>
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
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        <!-- 
            新增缴费记录模态框
         -->
        <div class="insertdialog">
            <!-- 
                elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
                :modal-append-to-body="false"
            -->
            <el-dialog title="添加缴费记录" :visible.sync="insertDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="insertForm">
                    <el-form-item label="*学生ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.studentid" autocomplete="off" style="width:300px;position:absolute;left:0;"></el-input>
                    </el-form-item>
                    <el-form-item label="*学生姓名" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.studentname" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*班级ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*缴费项目名称" :label-width="formLabelWidth">
                        <el-select v-model="insertForm.payname" placeholder="选择缴费名称" style="position:absolute;left:0">
                            <el-option label="保教费" value="保教费"></el-option>
                            <el-option label="生活费" value="生活费"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="*缴费方式" :label-width="formLabelWidth">
                        <el-select v-model="insertForm.paytype" placeholder="选择缴费方式" style="position:absolute;left:0">
                            <el-option label="按学期缴费" value="0"></el-option>
                            <el-option label="按月缴费" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="*缺席天数" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.absence" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="价格/(学期/月)" :label-width="formLabelWidth">
                        <el-input v-model="insertUnits" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*数量" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.num" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="书本费" :label-width="formLabelWidth">
                        <el-input v-model="insertBookFee" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="退费金额" :label-width="formLabelWidth">
                        <el-input v-model="insertRefee" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="应缴费用" :label-width="formLabelWidth">
                        <el-input v-model="insertFee" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*缴费时间" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.paydate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date"></el-input>
                    </el-form-item>
                    <el-form-item label="*缴费补充说明" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.other" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="insertDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addBill">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <!-- 
            修改缴费记录模态框
         -->
        <div class="updatedialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
        -->
            <el-dialog title="更新收费信息" :visible.sync="updateDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="updateForm">
                    <el-form-item label="账单编号" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.payid" autocomplete="off" style="width:300px;position:absolute;left:0;" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*学生ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.studentid" autocomplete="off" style="width:300px;position:absolute;left:0;"></el-input>
                    </el-form-item>
                    <el-form-item label="*学生姓名" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.studentname" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*班级ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*缴费项目名称" :label-width="formLabelWidth">
                        <el-select v-model="updateForm.payname" placeholder="选择缴费名称" style="position:absolute;left:0">
                            <el-option label="保教费" value="保教费"></el-option>
                            <el-option label="生活费" value="生活费"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="*缴费方式" :label-width="formLabelWidth">
                        <el-select v-model="updateForm.paytype" placeholder="选择缴费方式" style="position:absolute;left:0">
                            <el-option label="按学期缴费" value="0"></el-option>
                            <el-option label="按月缴费" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="*缺席天数" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.absence" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="价格/(学期/月)" :label-width="formLabelWidth">
                        <el-input v-model="updateUnits" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*数量" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.num" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="书本费" :label-width="formLabelWidth">
                        <el-input v-model="updateBookFee" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="退费金额" :label-width="formLabelWidth">
                        <el-input v-model="updateRefee" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="应缴费用" :label-width="formLabelWidth">
                        <el-input v-model="updateFee" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*缴费时间" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.paydate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date"></el-input>
                    </el-form-item>
                    <el-form-item label="*缴费补充说明" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.other" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyStudent">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>
<script>

import {
    queryallbill,
    insertBill,
    updateBill
} from '../../../network/home'

export default {
    name:'paymanager',

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
                other: '缴费补充说明',
            },
            dataList:[],

            studentid: '',

            classid:'',

            payname: '',

            pagesize:5,

            total:0,

            currentPage1:1,

            formLabelWidth: '120px',

            // 增加班级模态框显示状态，默认false
            insertDialogFormVisible:false,

            insertForm: {
                studentid: '',
                studentname: '',
                classid: '',
                payname:'',
                paytype:'',
                absence:'0',
                num:1,
                paydate:'',
                other:''
            },

            // 修改缴费信息模态框显示状态，默认false
            updateDialogFormVisible:false,

            updateForm: {
                payid:'',
                studentid: '',
                studentname: '',
                classid: '',
                payname:'',
                paytype:'',
                absence:'0',
                num:1,
                paydate:'',
                other:''
            },

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
            pagesize:this.pagesize
        }
        console.log('1111');
        queryallbill(data).then(res=>{
            let result = res.data
            console.log(res);
            this.total = result.totalSize
            this.dataList = result.content
            console.log('加载全部：',this.dataList);
        })
    },
    computed:{
        insertUnits(){
            let result = 0
            if(this.insertForm.payname==('保教费')&&this.insertForm.paytype==0){
                result = 1000
            }else if(this.insertForm.payname==('保教费')&&this.insertForm.paytype==1){
                result = 400
            }else if(this.insertForm.payname==('生活费')&&this.insertForm.paytype==0){
                result = 500
            }else if(this.insertForm.payname==('生活费')&&this.insertForm.paytype==1){
                result = 120
            }
            return result
        },
        insertBookFee(){
            let result = 0
            if(this.insertForm.payname==('保教费')&&this.insertForm.paytype==1){
                result=50
            }
            return result
        },
        insertRefee(){
            let result = 0
            if(this.insertForm.payname=='保教费'&&this.insertForm.paytype==0&&this.insertForm.absence>=20){
                result = 500
            }
            else if(this.insertForm.payname==('保教费')&&this.insertForm.paytype==1&&this.insertForm.absence>=7){
                result = 200
            }
            else if(this.insertForm.payname==('生活费')&&this.insertForm.paytype==0&&this.insertForm.absence>=20){
                result = 250
            }
            else if(this.insertForm.payname==('生活费')&&this.insertForm.paytype==1&&this.insertForm.absence>=7){
                result = 60
            }
            return result
        },
        insertFee(){
            let result = 0
            result = this.insertUnits * this.insertForm.num - this.insertRefee + this.insertBookFee
            return result
        },

        updateUnits(){
            let result = 0
            if(this.updateForm.payname==('保教费')&&this.updateForm.paytype==0){
                result = 1200
            }else if(this.updateForm.payname==('保教费')&&this.updateForm.paytype==1){
                result = 400
            }else if(this.updateForm.payname==('生活费')&&this.updateForm.paytype==0){
                result = 500
            }else if(this.updateForm.payname==('生活费')&&this.updateForm.paytype==1){
                result = 120
            }
            return result
        },
        updateBookFee(){
            let result = 0
            if(this.updateForm.payname==('保教费')&&this.updateForm.paytype==1){
                result=50
            }
            return result
        },
        updateRefee(){
            let result = 0
            if(this.updateForm.payname=='保教费'&&this.updateForm.paytype==0&&this.updateForm.absence>=20){
                result = 500
            }
            else if(this.updateForm.payname==('保教费')&&this.updateForm.paytype==1&&this.updateForm.absence>=7){
                result = 200
            }
            else if(this.updateForm.payname==('生活费')&&this.updateForm.paytype==0&&this.updateForm.absence>=20){
                result = 250
            }
            else if(this.updateForm.payname==('生活费')&&this.updateForm.paytype==1&&this.updateForm.absence>=7){
                result = 60
            }
            return result
        },
        updateFee(){
            let result = 0
            result = this.updateUnits * this.updateForm.num - this.updateRefee + this.updateBookFee
            return result
        }
    },
    methods:{
        // handdle(row){
        //     console.log(row);
        // },
        // 编辑事件——打开dialog
        handleEdit(index, row) {
            this.updateForm.payid = row.payid
            this.updateForm.absence = row.absence
            this.updateForm.num = row.num
            this.updateForm.payname = row.payname
            this.updateForm.paytype = row.paytype
            this.updateForm.studentid = row.studentid
            this.updateForm.studentname = row.studentname
            this.updateForm.classid = row.classid
            this.updateForm.paydate = row.paydate
            this.updateForm.other = row.other
            this.updateDialogFormVisible = true
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
        // 打开新增dialog
        insertDialogFormVisibleControl(){
            this.insertDialogFormVisible = true
        },

        // 获取学期开始时间和结束时间
        handleChange(value){
            let timeArr = value[1].split(' ')
            this.startime = timeArr[0]
            this.endtime = timeArr[1]
            console.log(this.startime);
            console.log(this.endtime);
        },

        // 条件查询缴费记录
        queryBillByItems(){
            let data = {
                pagenum:this.currentPage1,
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

        // 添加缴费记录方法
        addBill(){
            let data = {
                studentid: parseInt(this.insertForm.studentid),
                studentname: this.insertForm.studentname,
                classid: parseInt(this.insertForm.classid),
                payname:this.insertForm.payname,
                paytype:parseInt(this.insertForm.paytype),
                absence:parseInt(this.insertForm.absence),
                num:parseInt(this.insertForm.num),
                paydate:this.insertForm.paydate,
                other:this.insertForm.other,
                units:parseInt(this.insertUnits),
                bookfee:parseInt(this.insertBookFee),
                refee:parseInt(this.insertBookFee),
                fee:parseInt(this.insertFee)
            }
            insertBill(data).then(res=>{
                let result = res.data
                if(result.code==200){
                    alert("添加成功")
                    this.insertDialogFormVisible = false
                    this.queryBillByItems()
                    this.insertForm.studentid = ''
                    this.insertForm.studentname = ''
                    this.insertForm.classid = ''
                    this.insertForm.payname = ''
                    this.insertForm.paytype = ''
                    this.insertForm.absence = 0
                    this.insertForm.num = 1
                    this.insertForm.paydate = ''
                    this.insertForm.other = ''
                }
                else{
                    alert("添加失败")
                }
            })
        },

        // 编辑教师信息方法
        modifyStudent(){
            let data = {
                payid : parseInt(this.updateForm.payid),
                studentid: parseInt(this.updateForm.studentid),
                studentname: this.updateForm.studentname,
                classid: parseInt(this.updateForm.classid),
                payname:this.updateForm.payname,
                paytype:parseInt(this.updateForm.paytype),
                absence:parseInt(this.updateForm.absence),
                num:parseInt(this.updateForm.num),
                paydate:this.updateForm.paydate,
                other:this.updateForm.other,
                units:parseInt(this.updateUnits),
                bookfee:parseInt(this.updateBookFee),
                refee:parseInt(this.updateBookFee),
                fee:parseInt(this.updateFee)
            }
            updateBill(data).then(res=>{
                let result = res.data
                if(result.code==200){
                    alert("修改成功")
                    this.updateDialogFormVisible = false
                    this.queryBillByItems()
                }
                else{
                    alert("修改失败")
                }
            })
        },
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