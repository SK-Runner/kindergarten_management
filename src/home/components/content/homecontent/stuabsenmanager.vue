<template>
    <div class="stuabsenmanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>请假记录表</span>
            </div>
            <div class="condition">
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
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.status==0"
                        style="margin-right: 10px">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                        style="margin-left: 0">删除</el-button>
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
                title="假条状态代码说明【0：待审核；1：未审批；2：已审批】"
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
            创建假条模态框
         -->
        <div class="insertdialog">
            <!-- 
                elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
                :modal-append-to-body="false"
            -->
            <el-dialog title="创建假条记录" :visible.sync="insertDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="insertForm">
                    <el-form-item label="*学生ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.studentid" autocomplete="off" style="width:300px;position:absolute;left:0;" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*学生姓名" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.studentname" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*班级ID" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*请假原因" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.cause" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*请假时间" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.absendate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="insertDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addLeave">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <!-- 
            修改假条模态框
         -->
        <div class="updatedialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
        -->
            <el-dialog title="修改假条" :visible.sync="updateDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="updateForm">
                    <el-form-item label="*请假单号" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.absenteeismid" autocomplete="off" style="width:300px;position:absolute;left:0;" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*学生ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.studentid" autocomplete="off" style="width:300px;position:absolute;left:0;" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*学生姓名" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.studentname" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*班级ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.classid" autocomplete="off" style="width:300px;position:absolute;left:0" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="*请假原因" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.cause" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="*请假时间" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.absendate" autocomplete="off" style="width:300px;position:absolute;left:0" type="date"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyLeave">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>
<script>

import {
    queryLeave,
    createLeave,
    updateLeave,
    delLeave
} from '../../../network/home'

export default {
    name:'stuabsenmanager',

    data() {
        return {
            dataColum:{
                absenteeismid: '请假单号',
                studentid: '学生ID',
                studentname: '学生姓名',
                classid: '所属班级',
                cause: '请假原因',
                absendate: '请假时间',
                status: '假条状态',
            },
            dataList:[],

            studentid: 6,
            studentname: '天天',
            classid:1,

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
                cause: '',
                absendate: '',
            },

            // 修改缴费信息模态框显示状态，默认false
            updateDialogFormVisible:false,

            updateForm: {
                absenteeismid: '',
                studentid: '',
                studentname: '',
                classid: '',
                cause: '',
                absendate: '',
            },
        }
    },
    mounted(){
        // 动态设置学期起始和结束时间
        // let now = new Date()
        // for(let i = 3,j=0 ; i > -4 ; i--,j++){
        //     this.options[j].value = now.getFullYear()+i
        //     this.options[j].label = now.getFullYear()+i
        //     this.options[j].children[0].value = (this.options[j].value).toString() + '-03' + ' ' + this.options[j].value.toString() + '-08'
        //     this.options[j].children[0].label = '春季'
        //     this.options[j].children[1].value = this.options[j].value.toString() + '-09' + ' ' + (this.options[j].value+1).toString() + '-02'
        //     this.options[j].children[1].label = '秋季'
        // }

        // 加载全部数据
        let data = {
            pagenum:this.currentPage1,
            pagesize:this.pagesize,
            studentid:parseInt(this.studentid)
        }
        queryLeave(data).then(res=>{
            let result = res.data
            console.log(res);
            this.total = result.totalSize
            this.dataList = result.content
            console.log('加载全部：',this.dataList);
        })
    },
    methods:{
        // handdle(row){
        //     console.log(row);
        // },
        // 编辑事件——打开dialog
        handleEdit(index, row) {
            this.updateForm.absenteeismid = row.absenteeismid
            this.updateForm.studentid = row.studentid
            this.updateForm.studentname = row.studentname
            this.updateForm.classid = row.classid
            this.updateForm.cause = row.cause
            this.updateForm.absendate = row.absendate
            this.updateDialogFormVisible = true
        },

        handleDelete(index, row){
            console.log(row.absenteeismid);
            let data = { 
                absenteeismid:parseInt(row.absenteeismid)
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
                studentid:parseInt(this.studentid),
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
            this.insertForm.studentid = this.studentid
            this.insertForm.studentname = this.studentname
            this.insertForm.classid = this.classid
            this.insertDialogFormVisible = true
        },

        // 获取学期开始时间和结束时间
        // handleChange(value){
        //     let timeArr = value[1].split(' ')
        //     this.startime = timeArr[0]
        //     this.endtime = timeArr[1]
        //     console.log(this.startime);
        //     console.log(this.endtime);
        // },

        // 条件查询缴费记录
        queryLeave(){
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                studentid:parseInt(this.studentid),
            }
            queryLeave(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });
        },

        // 添加缴费记录方法
        addLeave(){
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
                }
                else{
                    alert("创建失败")
                }
            })
        },

        // 编辑教师信息方法
        modifyLeave(){
            let data = {
                absenteeismid : parseInt(this.updateForm.absenteeismid),
                studentid: parseInt(this.updateForm.studentid),
                studentname: this.updateForm.studentname,
                classid: parseInt(this.updateForm.classid),
                cause:this.updateForm.cause,
                absendate:this.updateForm.absendate,
            }
            updateLeave(data).then(res=>{
                let result = res.data
                if(result.code==200){
                    alert("修改成功")
                    this.updateDialogFormVisible = false
                    this.queryLeave()
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