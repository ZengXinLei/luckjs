const fs = require('fs')
// 将JS源码转换成语法树
const parser = require("@babel/parser");
// 遍历AST树节点
const traverse = require("@babel/traverse").default;
let path = require("path");


function listFile(dir) {
    let list = [];
    let arr = fs.readdirSync(dir);
    arr.forEach(function (item) {
        let fullpath = path.join(dir, item);
        let stats = fs.statSync(fullpath);
        if (!stats.isDirectory()&&item!=='plugins.js') {
            list.push(fullpath);
        }
    });
    return list;
}
let files = listFile('./ast_plugins/')
const plugins = {}
let curFile = ""
const traverses = {
    VariableDeclaration(path){
        let leadingComments = path.node.leadingComments
        if(!leadingComments || path.node.kind !=="const")
            return
        plugins[curFile]['CommentBlock'] = leadingComments[0]['value']
    }
}
files.map(file=>file.split(".")[0].split("\\")[1]).forEach(file=>{
    if(!file)
        return
    let content = fs.readFileSync('./ast_plugins/'+file+".js",'utf-8')
    let ast = parser.parse(content);
    curFile = file
    plugins[file]={
        obj:require('./'+file)
    }
    traverse(ast, traverses)

})
module.exports = plugins
