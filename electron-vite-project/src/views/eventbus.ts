// src/libs/eventBus.ts vue2支持eventBus监听函数,vue3要通过mitt模块实现
import mitt from 'mitt'
//导出实例
export default mitt()