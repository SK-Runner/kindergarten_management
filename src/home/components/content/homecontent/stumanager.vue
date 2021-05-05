<template>
    <div class="stumanager">

        <div class="head">
            <div class="formtitle">
                <img src="https://i.loli.net/2021/02/19/iAteG7RYBx4h56D.png" alt="">
                <span>学生信息表</span>
            </div>
            <div class="condition">
                <el-input v-model="username" placeholder="学生姓名" class="conditionitem"></el-input>
                <el-input v-model="phone" placeholder="电话号码" class="conditionitem"></el-input>
                <el-autocomplete
                    class="conditionitem"
                    v-model="state1"
                    :fetch-suggestions="querySearch"
                    placeholder="班级名字"
                    @select="handleSelect"
                    >
                </el-autocomplete>
                <el-select placeholder="是否有效" class="conditionitem" v-model="userstatus">
                    <el-option
                    v-for="item in userstatusitem"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="conditionitem" @click="queryStuByItems">搜索</el-button>
            </div>
            <div class="add-info">
                <el-button class="conditionitem" @click="insertDialogFormVisibleControl">添加学生</el-button>
            </div>
        </div>

        <div>
            <!-- @row-click="handdle" -->
            <el-table
            :data="dataList"
            style="width: 100%">
                <el-table-column prop="userid" label="学生ID"></el-table-column>
                <el-table-column prop="username" label="学生姓名"></el-table-column>
                <el-table-column prop="classid" label="班级ID"></el-table-column>
                <el-table-column prop="classname" label="班级名称"></el-table-column>
                <el-table-column prop="userstatus" label="账号状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userstatus=='0'">无效</span>
                        <span v-if="scope.row.userstatus=='1'">有效</span>
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
            新增学生模态框
         -->
        <div class="insertdialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
            增加班级的表单弹窗
        -->
            <el-dialog title="添加学生" :visible.sync="insertDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="insertForm">
                    <el-form-item label="学生姓名" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.username" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" :label-width="formLabelWidth">
                        <el-input v-model="insertForm.phone" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="班级名称" :label-width="formLabelWidth">
                        <el-autocomplete
                            style="width:300px;position:absolute;left:0"
                            v-model="state2"
                            :fetch-suggestions="insertSearch"
                            @select="inserthandleSelect"
                            >
                        </el-autocomplete>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="insertDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addStudent">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <!-- 
            更新学生模态框
         -->
        <div class="updatedialog">
        <!-- 
            elementUI bug:表单在遮罩内侧，需要设置下面这个属性为false
            :modal-append-to-body="false"
            增加班级的表单弹窗
        -->
            <el-dialog title="更新信息" :visible.sync="updateDialogFormVisible" :modal-append-to-body="false">
                <el-form :model="updateForm">
                    <el-form-item label="学生ID" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.userid" autocomplete="off" readonly  style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.username" autocomplete="off" style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.phone" autocomplete="off" readonly  style="width:300px;position:absolute;left:0"></el-input>
                    </el-form-item>
                    <el-form-item label="班级名称" :label-width="formLabelWidth">
                        <el-autocomplete
                            style="width:300px;position:absolute;left:0"
                            v-model="state3"
                            :fetch-suggestions="updateSearch"
                            @select="updatehandleSelect"
                            >
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="账号状态" :label-width="formLabelWidth">
                        <el-select v-model="updateForm.userstatus" placeholder="修改账号状态" style="position:absolute;left:0">
                            <el-option label="有效" value="1"></el-option>
                            <el-option label="无效" value="0"></el-option>
                        </el-select>
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
import{
queryallstu,
insertStudent,
updateStudent,
deleteStudent,
queryAllClassName,
queryClassById
} from '../../../network/home'

export default {
    name:'stumanager',

    data() {
        return {
            dataList:[],

            username: '',

            phone: '',

            classid: '',

            userstatus: '',
            userstatusitem: [{
                value: 0,
                label: '无效'
            }, {
                value: 1,
                label: '有效'
            }],

            pagesize:10,

            total:0,

            currentPage1:1,

            formLabelWidth: '120px',

            // 增加班级模态框显示状态，默认false
            insertDialogFormVisible:false,

            insertForm: {
                username: '',
                phone: '',
                classid: ''
            },

            // 修改班级模态框显示状态，默认false
            updateDialogFormVisible:false,

            updateForm: {
                userid: '',
                username: '',
                phone: '',
                classid: '',
                userstatus: '',
            },

            classes: [],
            state1: '',
            state2: '',
            state3: '',
        }
    },
    mounted(){
        this.classes = this.loadAll();
        // 加载全部数据
        let data = {
            pagenum:this.currentPage1,
            pagesize:this.pagesize
        }
        queryallstu(data).then(res=>{
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
            queryClassById({
                classid:row.classid
            }).then(res=>{
                this.state3 = res.data.classname
                this.updateForm.userid = row.userid,
                this.updateForm.username = row.username,
                this.updateForm.phone = row.phone,
                this.updateForm.classid = row.classid,
                this.updateForm.userstatus = row.userstatus
                this.updateDialogFormVisible = true
            })

        },
        // 删除事件
        handleDelete(index, row) {
            console.log(row.userid);
            let data = { 
                userid:parseInt(row.userid)
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteStudent(data).then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryStuByItems()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // 分页按钮查询
        handleCurrentChange(index){
            console.log(index);
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                username:this.username,
                classid:parseInt(this.classid),
                phone:this.phone,
                userstatus:parseInt(this.userstatus)
            }
            queryallstu(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });
        },

        // 打开新增学生dialog
        insertDialogFormVisibleControl(){
            this.insertDialogFormVisible = true
        },

        // 条件查询学生
        queryStuByItems(){
            let data = {
                pagenum:this.currentPage1,
                pagesize:this.pagesize,
                username:this.username,
                classid:parseInt(this.classid),
                phone:this.phone,
                userstatus:parseInt(this.userstatus)
            }
            queryallstu(data).then(res=>{
                let data = res.data
                console.log(res.data);
                this.total = data.totalSize
                this.dataList = data.content
                console.log('条件查询的结果',this.dataList);
            });

        },

        // 添加学生方法
        addStudent(){
            let data = {
                username:this.insertForm.username,
                classid:parseInt(this.insertForm.classid),
                phone:this.insertForm.phone
            }
            insertStudent(data).then(res=>{
                let result = res.data
                if(result.code==200){
                    alert("添加成功")
                    this.insertDialogFormVisible = false
                    this.queryStuByItems()
                }
                else{
                    alert("添加失败")
                }
            })
        },

        // 编辑学生信息方法
        modifyStudent(){
            let data = {
                userid:parseInt(this.updateForm.userid),
                username:this.updateForm.username,
                phone:this.updateForm.phone,
                classid:parseInt(this.updateForm.classid),
                userstatus:parseInt(this.updateForm.userstatus)
            }
            updateStudent(data).then(res=>{
                let result = res.data
                if(result.code==200){
                    alert("修改成功")
                    this.updateDialogFormVisible = false
                    this.queryStuByItems()
                }
                else{
                    alert("修改失败")
                }
            })
        },

      querySearch(queryString, cb) {
        var classes = this.classes;
        var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      insertSearch(queryString, cb) {
        var classes = this.classes;
        var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      updateSearch(queryString, cb) {
        var classes = this.classes;
        var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (classes) => {
          return (classes.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      insertCreateFilter(queryString) {
        return (classes) => {
          return (classes.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      updateCreateFilter(queryString) {
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
      handleSelect(item) {
        console.log(item);
        this.classid = item.id
      },
      inserthandleSelect(item) {
        console.log(item);
        this.insertForm.classid = item.id
      },
      updatehandleSelect(item){
        console.log(item);
        if(item.id){
            this.updateForm.classid = item.id
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