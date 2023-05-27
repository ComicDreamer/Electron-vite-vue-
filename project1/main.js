import express from 'express'
// 为了import需要设置express的type为module
const app = express()
// 监听7070端口
app.use(express.static('./public/'))
// 设置静态资源目录
app.listen(7070)
