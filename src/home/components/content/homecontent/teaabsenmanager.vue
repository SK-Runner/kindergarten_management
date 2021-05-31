<template>
    <div class="teaabsenmanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>请假记录表</span>
            </div>
            <div class="condition">
                <el-select 
                v-model="studentid" 
                placeholder="学生姓名"
                class="conditionitem">
                    <el-option
                        v-for="item in studentList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                    </el-option>
                </el-select>
                <el-button class="conditionitem" @click="queryLeave">查询全部</el-button>
            </div>
            <div class="add-info">
                <el-button class="conditionitem" @click="insertDialogFormVisibleControl">填写假条</el-button>
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
                <el-table-column prop="status" label="账号状态" min-width>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='0'">待审批</span>
                        <span v-if="scope.row.status=='1'">未同意</span>
                        <span v-if="scope.row.status=='2'">已同意</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.status==0"
                        style="margin-right: 10px">批准</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                        style="margin-left: 0">删除</el-button>
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
            创建假条模态框
         -->
        <div class="insertdialog">
            <!-- 
                elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
                :modal-append-to-body="false"
            -->
            <el-dialog title="创建假条记录" :visible.sync="insertDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="insertForm" :rules="insertRules" ref="insertRules">
                    <el-form-item label="班级ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="班级名称" :label-width="formLabelWidth">
                        <el-input v-model="classname" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" :label-width="formLabelWidth" prop="studentname">
                        <el-select 
                        v-model="insertForm.info" 
                        placeholder="请选择"
                        @change="stuChange"
                        style="width:300px;position:absolute;left:0">
                            <el-option
                                v-for="item in studentList"
                                :key="item.value"
                                :label="item.label"
                                :value="{value:item.value,label:item.label}"
                                :disabled="item.disabled"
                                v-show="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学生ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.studentid" autocomplete="off" readonly style="width:300px;position:absolute;left:0;"></el-input>
                    </el-form-item>
                    <el-form-item label="请假原因" :label-width="formLabelWidth" prop="cause">
                        <el-input v-model="insertForm.cause" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="请假时间" :label-width="formLabelWidth" prop="absendate">
                        <el-input v-model="insertForm.absendate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="insertDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addLeave">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>

import {
    queryLeave,
    createLeave,
    permitLeave,
    delLeave,
    queryClassById,
    getstudent
} from '../../../network/home'

export default {
    name:'teaabsenmanager',

    data() {
        return {
            dataColum:{
                absenteeismid: '请假单号',
                studentid: '学生ID',
                studentname: '学生姓名',
                classid: '班级ID',
                classname: '班级名称',
                cause: '请假原因',
                absendate: '请假时间',
            },
            dataList:[],

            studentid:'',

            classid:'',

            classname:'',

            pagesize:10,

            total:0,

            currentPage1:1,

            formLabelWidth: '120px',

            insertDialogFormVisible: false,
            insertForm: {
                studentid: '',
                studentname: '',
                classid: '',
                cause: '',
                absendate: '',
                info:{}
            },
            insertRules:{
                studentname:[
                    { required: true, message: '学生姓名不能为空', trigger: 'blur' }
                ],
                cause:[
                    { required: true, message: '请假原因必须填写', trigger: 'blur' }
                ],
                absendate:[
                    { required: true, message: '请假时间必须选择', trigger: 'blur' }
                ],
            },

            studentList:[
                {
                    disabled:false,
                    label:'请选择学生',
                    value:''
                }
            ],
        }
    },
    mounted(){
        let that = this
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.classid=userInfo.classid
        console.log(this.classid);
        // 加载全部数据
        let data = {
            pagenum:this.currentPage1,
            pagesize:this.pagesize,
            classid:parseInt(this.classid)
        }

        setTimeout(() => {
            queryLeave(data).then(res=>{
                let result = res.data
                console.log(res);
                this.total = result.totalSize
                this.dataList = result.content
                console.log('加载全部：',this.dataList);
            })         
        }, 500);
        getstudent({
            classid:that.classid,
            pagenum:1,
            pagesize:100
        }).then(res=>{
            let arr = res.data.content
            arr.forEach(function(item){
                let obj = {
                    label:item.username,
                    value:item.userid,
                    disabled:item.userstatus==1?false:true
                }
                that.studentList.push(obj)
            })
        })
    },
    methods:{
        // handdle(row){
        //     console.log(row);
        // },
        // 编辑事件——打开dialog
        handleEdit(index, row) {
            console.log(row.absenteeismid);
            this.$confirm('请批阅该条记录', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '同意',
                cancelButtonText: '拒绝',
                type: 'warning'
            }).then(() => {
                permitLeave({ 
                absenteeismid:parseInt(row.absenteeismid),
                status:'2'
                }).then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            type: 'success',
                            message: '审批成功!'
                        });
                        this.queryLeave()
                    }
                })
            }).catch((action) => {
                if(action === 'cancel'){
                    permitLeave({ 
                        absenteeismid:parseInt(row.absenteeismid),
                        status:'1'
                    }).then(res=>{
                        if(res.data.code==200){
                            this.$message({
                                type: 'success',
                                message: '审批成功!'
                            });
                            this.queryLeave()
                        }
                    })
                }
            });
        },
        handleDelete(index, row){
            console.log(row.absenteeismid);
            let data = { 
                absenteeismid:parseInt(row.absenteeismid)
            }
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delLeave(data).then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryLeave()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleCurrentChange(index){
            console.log(index);
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                classid:parseInt(this.classid),
            }
            queryLeave(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });
        },
        // 条件查询缺席记录
        queryLeave(){
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                studentid:parseInt(this.studentid),
                classid:parseInt(this.classid),
            }
            queryLeave(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });
        },
        // 打开新增dialog
        insertDialogFormVisibleControl(){
            let that = this
            queryClassById({
                classid:this.classid
            }).then(res=>{
                that.insertForm.classid = that.classid
                that.classname = res.data.classname
                that.insertDialogFormVisible = true
            })
        },
        // 创建假条方法
        addLeave(){
            this.$refs.insertRules.validate((valid)=>{
                if(valid){
                    let data = {
                        studentid: parseInt(this.insertForm.studentid),
                        studentname: this.insertForm.studentname,
                        classid: parseInt(this.insertForm.classid),
                        cause:this.insertForm.cause,
                        absendate:this.insertForm.absendate,
                    }
                    createLeave(data).then(res=>{
                        let result = res.data
                        if(result.code==200){
                            alert("创建成功")
                            this.insertDialogFormVisible = false
                            this.queryLeave()
                            this.insertForm.studentid = ''
                            this.insertForm.studentname = ''
                            this.insertForm.classid = ''
                            this.insertForm.cause = ''
                            this.insertForm.absendate = ''
                            this.insertForm.info = {}
                        }
                        else{
                            alert("创建失败")
                        }
                    })
                }else{
                    return false
                }
            })
        },
        stuChange(param){
            this.insertForm.studentname = param.label
            this.insertForm.studentid = param.value
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
        width: 130px;
    }
    .block{
        position: absolute;
        right: 2%;
    }
</style>