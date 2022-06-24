// 将JS源码转换成语法树
const parser = require("@babel/parser");
// 为parser提供模板引擎
const template = require("@babel/template").default;
// 遍历AST树节点
const traverse = require("@babel/traverse").default;

// 操作节点，比如判断节点类型，生成新的节点等
const types = require("@babel/types");
// 将语法树转换为源代码
const generator = require("@babel/generator").default;

const all_methods = require('./ast_plugins/plugins')

function get_traverses(decode_type) {
    return all_methods[decode_type]["obj"]
}

function get_decode_code(encode_code, plugin_types) {
    let decode_code = encode_code
    if(!plugin_types)
        return decode_code
    for (let i = 0; i < plugin_types.length; i++) {
        try {
            let plugin_type =plugin_types[i]
            let ast = parser.parse(decode_code);
            // 对原始文件进行操作，使用traverse遍历语法树
            let traverses = get_traverses(plugin_type)
            traverse(ast, traverses)
            //返回还原后的js文代码
            decode_code = generator(ast).code;
        }catch (e){
            console.log(e)
        }
    }

    return decode_code
}

module.exports = get_decode_code
