# Screenshot 截图

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
#截屏业务逻辑
1. 点击截屏，显示当前屏幕为可截图区域
2. 框选截图区域，生成画布
3. 取消按钮取消截图
4. 完成按钮完成截图
5. 拖动画布位置(有了批注后，就不能拖动，只能调整上下左右边框的位置)
6. 在画布上进行操作
7. 切换画笔颜色/画笔粗细/马赛克，redo/undo
8. 点击完成将画布区域转换成图片base64

#API

使用方法

:css 覆盖默认样式