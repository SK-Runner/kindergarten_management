// 1、引入glob,不需要配置，直接在src目录下新建单页面应用
const glob = require('glob')
// 2、定义自动生成页面的方法
function getPages(){
    // 得到当前项目中我们自己创建的页面对应的入口js文件路径数组
    let entries = glob.sync('./src/*/*.js')
    console.log(entries)

    // 声明pages对象
    let pages = {}

    // 遍历得到的js路径数组，从字符串中分割需要的页面名字
    entries.forEach((filePath)=>{
        let fileName = filePath.substring(filePath.lastIndexOf('/')+1 , filePath.lastIndexOf('.'))
        // 组建pages需要的值
        pages[fileName] = {
            entry:`src/${fileName}/${fileName}.js`,
            template:`public/${fileName}.html`,
            fileName:`${fileName}.html`,
            chunks:['chunk-vendors', 'chunk-common', fileName]
        }
        console.log(pages);
    })

    return pages
}


module.exports={
    pages:getPages(),
    // 设置初始启动路径
    publicPath: "/login",

    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "localhost", 
        port: '8080',
        https: false,
        hotOnly: false, 
        proxy: {
            '/api': {
                target: 'http://localhost:8989/', //API服务器的地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },


    // 设置别名
	configureWebpack:{
		resolve:{
			alias:{
				// '@':'src', 默认设置，不用再设置
				'assets':'@/home/assets',
				// 'common':'@/common',
				// 'components':'@/components',
				// 'network':'@/network',
				// 'views':'@/views',
				
				// 'router':'@/router'
				// 'store':'@/store'
			}
		}
	}

}
