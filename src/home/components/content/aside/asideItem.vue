<template>
    <div class="aside-item" @click="toContent">
        <img :src="picurl" alt="">
        {{pername}}
    </div>
</template>

<script>
export default {
    name:'asideItem',
    props:{
        contenturl:{
            type:String,
            default(){
                return ''
            }
        },
        pername:{
            type:String,
            default(){
                return ''
            }
        },
        picurl:{
            type:String,
            default(){
                return ''
            }
        },
    },
    methods:{
        toContent(){
            console.log(this.contenturl);
            this.$router.push(this.contenturl)
        }
    },
}
</script>

<style scoped>
    .aside-item{
        width: 200px;
        height: 40px;
        margin-bottom: 25px;
        margin-top: 5px;
        line-height: 40px;
        background-color: rgba(0, 0, 0, 0.5);
        color: rgba(255, 255, 255, 100);
        cursor: pointer;
    }
    .aside-item img{
        width: 30px;
        height: 30px;
        vertical-align: middle;
        margin-right: 10px;
        margin-top: -2px;
    }
</style>