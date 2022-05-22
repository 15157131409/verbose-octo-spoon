$(function(){
    const layer =layui.layer;
    const form =layui.form;
    const laypage= layui.laypage;
   // 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
    const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 5, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
};

// 定义获取文章列表数据的方法   initTable
    const initTable = function (){
        $.ajax({
            type: "GET",
            url:"/my/article/list",
            data:q,
            success: (res) => {
               if(res.status !== 0) return layer.msg('获取失败')
               layer.msg('获取成功')
               const htmlStr = template('tpl-table',res)
               $('tbody').html(htmlStr);

               renderPage(res.total)
            }
        })
    }   
    initTable()


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

         return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

        // 定义补零的函数
        function padZero(n) {
            return n > 9 ? n : '0' + n
        }


        // 获取文章分类
        const initCate= ()=>{
            $.ajax({
                type: 'GET',
                url:"/my/article/cates",
                success: (res) => {
                    if(res.status !== 0)  return layer.msg('获取文章分类失败')
                    layer.msg('获取文章分类成功')
                    // 
                    const htmlStr =template('tpl-cate',res)
                    $('[name=cate_id]').html(htmlStr)
                    form.render('select')
                }
            })
        }
        initCate()


        // 筛选功能
        $('#form-search').on('submit', function(e){
            e.preventDefault();
            const cate_id = $('[name=cate_id]').val();
            const state = $('[name=state]').val();

            q.cate_id =cate_id;
            q.state =state;
            initTable()
        })


        //定义分页的函数
        const renderPage=(total)=>{
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum ,// 设置默认被选中的分页

        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],// 每页展示多少条

        // 触发时机
        // 1.laypage.render 调用会触发(首次触发,我们不希望调用 initTable())
        // 2.切换页码时会触发  必须调用 initTable() 因为需要重新渲染数据
        jump: function(obj,first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            // console.log(obj.curr)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr

            // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
              q.pagesize = obj.limit

              // 根据最新的 q 获取对应的数据列表，并渲染表格
            if(!first) return  initTable()
        }
    })
 }


    // 删除文章
    $('tbody').on('click','.btn-delete',function(e){
        const id =$(this).attr('data-id');
        //11111111选中所有删除按钮  获取他的长度
        const len= $('.btn-delete').length
         // 询问用户是否要删除数据
          layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
            type:'GET',
            url:'/my/article/delete/' + id,
            success:(res)=>{
                if(res.status !==0) return layer.msg('删除文章失败')
                layer.msg('删除文章成功')
                // 11111111 判断一下 如果删除按钮的长度等于1 就相当于那一页就没有数据了
                // 就返回一个三元  q.pagenum  如果===1 就返回1  如果不等于1 就让他的q.pagenum-1
                if(len ===1) return q.pagenum = q.pagenum === 1 ? 1:q.pagenum -1
                initTable()
                
            }
        })
        layer.close(index)
    })
    })

})