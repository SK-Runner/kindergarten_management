import Vue from 'vue'
import axios from 'axios'

Vue.prototype.axios = axios

export default function request(config){

    const instance = axios.create({
        baseURL:'http://localhost:8989/',
        timeout:5000
    })

    return instance(config)
}