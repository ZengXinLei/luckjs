const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const get_decode_code = require("./AST_core");
const plugins = require("./ast_plugins/plugins");
const cors=require("cors");
app.use(bodyParser.json({
    limit: '10mb' //nodejs 做为服务器，在传输内容或者上传文件时，系统默认大小为100kb,改为10M
}));
app.use(bodyParser());
//设置跨域访问
app.use(cors())
// 允许跨域
app.all('*', function(req, res, next) {
    console.log(req.headers.origin)
    console.log(req.environ)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    // res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials","true");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

app.post('/decode_code', function (req, res) {
    try {
        let code = get_decode_code(req.body['code'],req.body['plugin_names'])
        return res.send({
            code:code,
            status:0,
            msg:""
        })
    }catch (e) {
        console.log(e)
        return res.send({
            code:"",
            status:500,
            msg:"程序出错，请联系管理员"
        })
    }
});
// app.get("/plugins",(req,res)=>{
//     return res.send(plugins)
// })
app.post("/plugins",(req,res)=>{
    return res.send(plugins)
})
app.listen(3000);
