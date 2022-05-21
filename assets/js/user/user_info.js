$(function() {
    // const form = layui.form;
    // // 自定义校验规则
    // form.verify({
    //     nickname: (val) => {
    //         if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
    //     },
    // });

    const form = layui.form;
    const layer = layui.layer;
    // 自定义校验规则
    form.verify({
        nickname: (val) => {
            if(val.length > 6) return '昵称长度必须在 1 ~ 6 个字符之间！'
        }
    })

    // get请求获取数据
    const initUserInfo=()=>{
        $.ajax({
            type: "GET",
            url:'/my/userinfo',
            success: (res) => {
                console.log(res);
                if(res.status !== 0) return layer.msg('获取用户信息失败')
                layer.msg('获取用户信息成功')
                // layui里面的替换  
                // 第一个值是名字  第二个值是替换的值  
                // 获取过来的res.data 数据
                form.val('formUserInfo',res.data)
            }
        })
    }

    initUserInfo()


    // 重置按钮
    $('#btnReset').click((e)=>{
        // 先清除表单
        e.preventDefault();
        // 在调用上面的函数 从新获取ajax
        initUserInfo()
    })

    // 跟新用户信息
    $('.layui-form').on('submit',function(e){
        e.preventDefault();

        $.ajax({
            type:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:(res)=>{
                if(res.status !== 0) return layer.msg('更改用户信息失败!')
                layer.msg('更改用户信息成功');

                // 调用index.js  更改用户头像旁边的名字 从新渲染 头像
                window.parent.getUserInfo();
            }
        })
    })
})