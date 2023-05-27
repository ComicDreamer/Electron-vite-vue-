// 单个导出
export var a = 1
export function b(){
    console.log('b')
} 

// 多个导出
var c = 1
var d = 2
export{c,d}

var e = 1
// 默认导出 一个js文件只能有一个
export default e