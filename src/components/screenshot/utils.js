var debounce = function (action, idle) {
    var last
    return function () {
        var ctx = this, args = arguments
        clearTimeout(last)
        last = setTimeout(function () {
            action.apply(ctx, args)
        }, idle)
    }
}

var getPageSize = function() {
    let width = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth, 
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
    let height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight, 
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
   )
   return { width, height }
}
export default { debounce, getPageSize }