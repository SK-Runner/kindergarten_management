<template>
    <div class="aside-container">
        <asideitem v-for="(item,index) in permisstion" :key="index" :contenturl="item.perurl" :pername="item.pername" :picurl="item.picurl"></asideitem>
    </div>
</template>

<script>
import asideitem from './asideItem'
export default {
    name:'asideContainer',
    components:{
        asideitem
    },
    data(){
        return {
            permisstion:[],
            
        }
    },
    mounted(){
        this.permisstion = JSON.parse(sessionStorage.getItem('permissions'))
    }
}
</script>

<style scoped>
.aside-container{
    display: flex;
    flex-wrap: wrap;
    justify-content:center;
}
</style>