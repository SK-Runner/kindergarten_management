<template>
    <div class="classmanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>班级信息表</span>
            </div>
            <div class="condition">
                <el-input v-model="classname" placeholder="班级名称" class="conditionitem"></el-input>
                <el-select placeholder="请选择年级" class="conditionitem" v-model="gradevalue">
                    <el-option
                    v-for="item in grade"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select placeholder="是否开班" class="conditionitem" v-model="validvalue">
                    <el-option
                    v-for="item in validclass"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button  class="conditionitem" @click="queryClassByItems">搜索</el-button>
            </div>
            <div class="add-info">
                <el-button  class="conditionitem" @click="insertDialogFormVisibleControl">增加班级</el-button>
            </div>
        </div>

        <div>
            <!-- @row-click="handdle" -->
            <el-table
            :data="dataList"
            style="width: 100%">
                <el-table-column prop="classid" label="班级ID"></el-table-column>
                <el-table-column prop="classname" label="班级名称"></el-table-column>
                <el-table-column prop="classstatus" label="班级状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.classstatus=='0'">未开班</span>
                        <span v-if="scope.row.classstatus=='1'">已开班</span>
                    </template>
                </el-table-column>
                <el-table-column prop="grade" label="所属年级">
                    <template slot-scope="scope">
                        <span v-if="scope.row.grade=='0'">小班</span>
                        <span v-if="scope.row.grade=='1'">中班</span>
                        <span v-if="scope.row.grade=='2'">大班</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            新增班级模态框
         -->
        <div class="insertdialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
            增加班级的表单弹窗
        -->
            <el-dialog title="新增班级" :visible.sync="insertDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="insertForm" :rules="insertRules" ref="insertForm">
                    <el-form-item label="班级名称" :label-width="formLabelWidth" prop="classname">
                        <el-input v-model="insertForm.classname" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="所属年级" :label-width="formLabelWidth" prop="grade">
                        <!-- 
                            解决选择器偏移问题 position:absolute;left:0
                        -->
                        <el-select v-model="insertForm.grade" placeholder="选择年级" style="position:absolute;left:0">
                            <el-option label="大班" value=2></el-option>
                            <el-option label="中班" value=1></el-option>
                            <el-option label="小班" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开班状态" :label-width="formLabelWidth" prop="classstatus">
                        <el-select v-model="insertForm.classstatus" placeholder="选择开班状态" style="position:absolute;left:0">
                            <el-option label="已开班" value=1></el-option>
                            <el-option label="未开班" value=0></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="insertDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addClass">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <!-- 
            更新班级模态框
         -->
        <div class="updatedialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
            增加班级的表单弹窗
        -->
            <el-dialog title="更新信息" :visible.sync="updateDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="updateForm">
                    <el-form-item label="班级ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.classid" autocomplete="off" readonly  style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="班级名称" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.classname" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="所属年级" :label-width="formLabelWidth">
                        <!-- 
                            解决选择器偏移问题 position:absolute;left:0
                        -->
                        <el-select v-model="updateForm.grade" placeholder="选择年级" style="position:absolute;left:0">
                            <el-option label="大班" value="2"></el-option>
                            <el-option label="中班" value="1"></el-option>
                            <el-option label="小班" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开班状态" :label-width="formLabelWidth">
                        <el-select v-model="updateForm.classstatus" placeholder="选择开班状态" style="position:absolute;left:0">
                            <el-option label="已开班" value="1"></el-option>
                            <el-option label="未开班" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyClass">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>
<script>

import{
queryallcla,
insertClass,
updateClass,
deleteClass
} from '../../../network/home'

export default {
    name:'classmanager',

    data() {
        return {
            dataColum:{
                classid: '班级ID',
                classname: '班级名称',
                classstatus: '开班状态',
                grade: '所属年级'
            },
            dataList:[],
            grade: [{
                value: 0,
                label: '小班'
            }, {
                value: 1,
                label: '中班'
            }, {
                value: 2,
                label: '大班'
            }],

            validclass: [{
                value: 0,
                label: '未开班'
            }, {
                value: 1,
                label: '已开班'
            },],

            gradevalue:'',

            validvalue:'',

            classname:'',

            pagesize:10,

            total:0,

            currentPage1:1,

            formLabelWidth: '120px',

            // 增加班级模态框显示状态，默认false
            insertDialogFormVisible:false,

            insertForm: {
                classname: '',
                classstatus: '',
                grade: ''
            },

            insertRules:{
                classname:[
                    { required: true, message: '请输入班级名称', trigger: 'blur' },
                    { min: 2, max: 5, message: '班级名称在2到5个字符之间', trigger: 'blur' }
                ],
                classstatus:[
                    { required: true, message: '请选择开班状态', trigger: 'blur' }
                ],
                grade:[
                    { required: true, message: '请选择所属年级', trigger: 'blur' }
                ],
            },

            // 修改班级模态框显示状态，默认false
            updateDialogFormVisible:false,

            updateForm: {
                classid: '',
                classname: '',
                classstatus: '',
                grade: ''
            },


        }
    },
    created(){
        let role = JSON.parse(sessionStorage.getItem('userInfo')).roleid
        console.log('role',role);
        if(role==1){
            this.$router.replace('/dynamic')
        }else if(role==2){
            this.$router.replace('/studynamic')
        }
    },
    mounted(){
        // 加载全部数据
        let data = {
            pagenum:this.currentPage1,
            pagesize:this.pagesize
        }
        queryallcla(data).then(res=>{
            let data = res.data
            console.log(res.data);
            this.total = data.totalSize
            this.dataList = data.content
            console.log('加载全部：',this.dataList);
        })
    },
    computed:{
        classStatus(){
            return function(item,index){
                console.log(item,index);
                let result = ''
                if(index == 2){
                    switch(item){
                        case 0:
                            result = "未开班"
                            break;
                        case 1:
                            result = "已开班"
                            break;
                    }
                }else if(index ==3){
                    switch(item){
                        case 0:
                            result = "小班"
                            break;
                        case 1:
                            result = "中班"
                            break;
                        case 2:
                            result = "大班"
                            break;
                    }
                }else{
                    result = item
                }
                return result
            }
        }
    },
    methods:{
        // handdle(row){
        //     console.log(row);
        // },
        // 编辑事件——打开dialog
        handleEdit(index, row) {
            this.updateForm.classid = row.classid
            this.updateForm.classname = row.classname
            this.updateForm.classstatus = row.classstatus.toString()
            this.updateForm.grade = row.grade.toString()
            this.updateDialogFormVisible = true
        },
        // 删除事件
        handleDelete(index, row) {
            console.log(row.classid);
            
            let data = { 
                classid:parseInt(row.classid)
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteClass(data).then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryClassByItems()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 分页按钮事件
        handleCurrentChange(index){
            console.log(index);
            let data = {
                pagenum:index,
                pagesize:this.pagesize,
                classname:this.classname,
                classstatus:parseInt(this.validvalue),
                grade:parseInt(this.gradevalue),
            }
            queryallcla(data).then(res=>{
                console.log('result：',res.data.content)
                this.dataList = res.data.content
                console.log('条件查询的结果',this.dataList);
            });
        },
        // 打开新增班级dialog
        insertDialogFormVisibleControl(){
            this.insertDialogFormVisible = true
        },
        // 条件查询班级
        queryClassByItems(){
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                classname:this.classname,
                classstatus:parseInt(this.validvalue),
                grade:parseInt(this.gradevalue),
            }
            queryallcla(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
        });

        },
        // 添加班级方法
        addClass(){
            this.$refs.insertForm.validate((valid) => {
                if(valid){
                    let data = {
                        classname:this.insertForm.classname,
                        classstatus:parseInt(this.insertForm.classstatus),
                        grade:parseInt(this.insertForm.grade)
                    }
                    insertClass(data).then(res=>{
                        let result = res.data
                        if(result.code==200){
                            alert("添加成功")
                            this.insertDialogFormVisible = false
                            let empty = {
                                classname: '',
                                classstatus: '',
                                grade: ''
                            }
                            Object.assign(this.insertForm,empty)
                            this.queryClassByItems()
                        }
                        else{
                            alert("添加失败")
                        }
                    })
                }else{
                    return false
                }
            })
        },
        // 编辑班级方法
        modifyClass(){
            this.$confirm('您确定修改班级信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    classid:parseInt(this.updateForm.classid),
                    classname:this.updateForm.classname,
                    classstatus:parseInt(this.updateForm.classstatus),
                    grade:parseInt(this.updateForm.grade)
                }
                updateClass(data).then(res=>{
                    let result = res.data
                    if(result.code==200){
                        alert("修改成功")
                        this.updateDialogFormVisible = false
                        this.queryClassByItems()
                    }
                    else{
                        alert("修改失败")
                    }
                })
            })
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