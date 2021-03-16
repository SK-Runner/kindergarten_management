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
                <el-table-column
                    v-for="(item,index) in dataColum"
                    :key="index"
                    :label="item"
                    >
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
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="instructionswords">
            <el-alert
                title="年级代码说明【0：小班；1：中班；2：大班】"
                type="success">
            </el-alert>
            <el-alert
                title="开班状态代码说明【0：未开班；1：已开班】"
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
            新增班级模态框
         -->
        <div class="insertdialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
            增加班级的表单弹窗
        -->
            <el-dialog title="新增班级" :visible.sync="insertDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="insertForm">
                    <el-form-item label="班级名称" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.classname" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="所属年级" :label-width="formLabelWidth">
                        <!-- 
                            解决选择器偏移问题 position:absolute;left:0
                        -->
                        <el-select v-model="insertForm.grade" placeholder="选择年级" style="position:absolute;left:0">
                            <el-option label="大班" value=2></el-option>
                            <el-option label="中班" value=1></el-option>
                            <el-option label="小班" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开班状态" :label-width="formLabelWidth">
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
    methods:{
        // handdle(row){
        //     console.log(row);
        // },
        // 编辑事件——打开dialog
        handleEdit(index, row) {
            this.updateForm.classid = row.classid
            this.updateForm.classname = row.classname
            this.updateForm.classstatus = row.classstatus
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
                    this.queryClassByItems()
                }
                else{
                    alert("添加失败")
                }
            })
        },
        // 编辑班级方法
        modifyClass(){
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
        width: 25%;
        display: inline-block;
    }
    .block{
        position: absolute;
        right: 2%;
    }
</style>