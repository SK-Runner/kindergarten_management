<template>
    <div class="paymanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>缴费记录表</span>
            </div>
            <div class="condition">
                <el-input v-model="studentid" placeholder="学生ID" class="conditionitem"></el-input>
                <el-autocomplete
                    class="conditionitem"
                    v-model="state1"
                    :fetch-suggestions="querySearch"
                    placeholder="班级名字"
                    @select="handleSelect"
                    >
                </el-autocomplete>
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
                <el-table-column prop="paytype" label="缴费方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.paytype=='0'">学期</span>
                        <span v-if="scope.row.paytype=='1'">月</span>
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
                    <el-form-item label="*班级名称" :label-width="formLabelWidth">
                        <el-autocomplete
                            class="conditionitem"
                            v-model="state2"
                            :fetch-suggestions="insertSearch"
                            placeholder="请选择"
                            @select="insertHandleSelect"
                            style="width:300px;position:absolute;left:0"
                            >
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="*班级ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*学生姓名" :label-width="formLabelWidth">
                        <el-autocomplete
                            class="conditionitem"
                            v-model="state3"
                            :fetch-suggestions="insertStudentSearch"
                            placeholder="请选择"
                            @select="insertStudentHandleSelect"
                            style="width:300px;position:absolute;left:0"
                            >
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="*学生ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.studentid" autocomplete="off" style="width:300px;position:absolute;left:0;" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*起始时间" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.startdate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date" @input="queryAbsence"></el-input>
                    </el-form-item>
                    <el-form-item label="*到期时间" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.endate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date" @input="queryAbsence"></el-input>
                    </el-form-item>
                    <el-form-item label="*缺席天数" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.absence" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
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
                    <el-form-item label="*班级名称" :label-width="formLabelWidth">
                        <el-autocomplete
                            class="conditionitem"
                            v-model="state4"
                            :fetch-suggestions="updateSearch"
                            placeholder="请选择"
                            @select="updateHandleSelect"
                            style="width:300px;position:absolute;left:0"
                            >
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="*班级ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*学生姓名" :label-width="formLabelWidth">
                        <el-autocomplete
                            class="conditionitem"
                            v-model="state5"
                            :fetch-suggestions="updateStudentSearch"
                            placeholder="请选择"
                            @select="updateStudentHandleSelect"
                            style="width:300px;position:absolute;left:0"
                            >
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="*学生ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.studentid" autocomplete="off" style="width:300px;position:absolute;left:0;" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*起始时间" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.startdate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date" @input="queryAbsence"></el-input>
                    </el-form-item>
                    <el-form-item label="*到期时间" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.endate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date" @input="queryAbsence"></el-input>
                    </el-form-item>
                    <el-form-item label="*缺席天数" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.absence" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
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
                    <el-button type="primary" @click="modifyBill">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>
<script>

import {
    queryLeave,
    queryallbill,
    insertBill,
    updateBill,
    queryAllClassName,
    // queryClassById,
    getstudent
} from '../../../network/home'

export default {
    name:'paymanager',

    data() {
        return {
            dataColum:{
                payid: '缴费单号',
                studentid: '学生ID',
                studentname: '学生姓名',
                classname: '所属班级',
                payname: '缴费项目名称',
                // paytype: '缴费方式',
                absence: '缺席天数',
                units: '价格/(学期/月)',
                num: '数量',
                bookfee: '书本费',
                refee: '退费金额',
                fee: '应缴费用',
                paydate: '缴费时间',
                startdate: '起始时间',
                endate: '到期时间',
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
                startdate:'',
                endate:'',
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
                startdate:'',
                endate:'',
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

            classes: [],
            state1: '',
            state2: '',
            state3: '',
            state4: '',
            state5: '',
            studentList:[],
        }
    },
    mounted(){
        this.classes = this.loadAll();
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
        setTimeout(() => {
            queryallbill(data).then(res=>{
                let result = res.data
                console.log(res);
                this.total = result.totalSize
                this.dataList = result.content
                console.log('加载全部：',this.dataList);
            })
        }, 500);

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
            // this.updateForm.studentid = row.studentid
            // this.updateForm.studentname = row.studentname
            // this.updateForm.classid = row.classid
            this.updateForm.paydate = row.paydate
            this.updateForm.startdate = row.startdate
            this.updateForm.endate = row.endate
            this.updateForm.other = row.other
            this.state4 = row.classname
            this.state5 = row.studentname
            let item1 = {
                id: row.classid,
                value: row.classname
            }
            let item2 = {
                id: row.studentid,
                value: row.studentname
            }
            this.updateHandleSelect(item1)
            this.updateStudentHandleSelect(item2)
            this.updateDialogFormVisible = true
        },
        handleCurrentChange(index){
            console.log(index);
            let data = {
                pagenum:index,
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
                units:parseInt(this.insertUnits),
                bookfee:parseInt(this.insertBookFee),
                refee:parseInt(this.insertBookFee),
                fee:parseInt(this.insertFee)
            }
            Object.assign(data,this.insertForm)
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
                    this.insertForm.endate = ''
                    this.insertForm.other = ''
                }
                else{
                    alert("添加失败")
                }
            })
        },

        // 编辑教师信息方法
        modifyBill(){
            let data = {
                units:parseInt(this.updateUnits),
                bookfee:parseInt(this.updateBookFee),
                refee:parseInt(this.updateBookFee),
                fee:parseInt(this.updateFee)
            }
            Object.assign(data,this.updateForm)
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

        createFilter(queryString) {
            return (classes) => {
            return (classes.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        loadAll() {
            let data = [
                {
                    value:'无限制',
                    id:''
                }

            ]
            queryAllClassName().then(res=>{
                console.log('班级名字',res.data);
                let arr = res.data
                arr.forEach(function(item){
                    let obj = {
                        value:item.classname,
                        id:item.classid
                    }
                    data.push(obj)
                })
            })
            return data;
        },

        querySearch(queryString, cb) {
            var classes = this.classes;
            var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelect(item) {
            console.log(item);
            this.classid = item.id
        },

        insertSearch(queryString, cb) {
            var classes = this.classes;
            var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        insertHandleSelect(item) {
            console.log(item);
            this.insertForm.classid = item.id
            this.getStudentFun('insert')
        },

        insertStudentSearch(queryString, cb) {
            var studentList = this.studentList;
            var results = queryString ? studentList.filter(this.createFilter(queryString)) : studentList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        insertStudentHandleSelect(item) {
            console.log(item);
            this.insertForm.studentid = item.id
            this.insertForm.studentname = item.value
        },

        updateSearch(queryString, cb) {
            var classes = this.classes;
            var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        updateHandleSelect(item) {
            console.log(item);
            this.updateForm.classid = item.id
            this.getStudentFun('update')
        },

        updateStudentSearch(queryString, cb) {
            var studentList = this.studentList;
            var results = queryString ? studentList.filter(this.createFilter(queryString)) : studentList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        updateStudentHandleSelect(item) {
            console.log(item);
            this.updateForm.studentid = item.id
            this.updateForm.studentname = item.value
        },

        getStudentFun(type){
            let that = this
            that.studentList = []
            let classid = ''
            if(type == 'insert'){
                classid = parseInt(that.insertForm.classid)
            }else{
                classid = parseInt(that.updateForm.classid)
            }
            getstudent({
                classid,
                pagenum:1,
                pagesize:100
            }).then(res=>{
                let arr = res.data.content
                arr.forEach(function(item){
                    let obj = {
                        value:item.username,
                        id:item.userid
                    }
                    that.studentList.push(obj)
                })
            })
        },

        queryAbsence(type){
            if(type=='insert'){
                if(this.insertForm.startdate && this.insertForm.endate && this.insertForm.studentid){
                    queryLeave({
                        pagenum:this.currentPage1,
                        pagesize:this.pagesize,
                        studentid:this.insertForm.studentid,
                        startime:this.insertForm.startdate,
                        endtime:this.insertForm.endate
                    }).then(res=>{
                        let result = res.data
                        console.log(res);
                        this.insertForm.absence = result.totalSize
                    }) 
                }else{
                    return
                }
            }else {
                if(this.updateForm.startdate && this.updateForm.endate && this.updateForm.studentid){
                    queryLeave({
                        pagenum:this.currentPage1,
                        pagesize:this.pagesize,
                        studentid:this.updateForm.studentid,
                        startime:this.updateForm.startdate,
                        endtime:this.updateForm.endate
                    }).then(res=>{
                        let result = res.data
                        console.log(res);
                        this.updateForm.absence = result.totalSize
                    }) 
                }else{
                    return
                }
            }
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
    .block{
        position: absolute;
        right: 2%;
    }
</style>