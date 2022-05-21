$(function() {
    getUserInfo();

    // 退出功能 
    // 获取layer
    const layer = layui.layer;
    $('#btnLogout').click(() => {
        layer.confirm('确认是否退出',{ icon: 3, title: "" },function (index) {
            // 清空本地存储里面的 token
            localStorage.removeItem('token');
            // 重新跳转到登录页面
            location.href = '/login.html'
        })
    })
});

const layer = layui.layer;

// 获取用户信息函数
function getUserInfo () {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // 往请求头里注入 token (后续写在baseAPI中)
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: (res) => {
            console.log(res);
            if(res.status !== 0) return layer.msg('获取用户信息失败');
            layer.msg('获取用户信息成功');
            
            // 调用渲染头像函数
            randerAvatar(res.data);
        },

        
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: (res) => {
        //     console.log(res);
        // // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        // if(res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //     // 强制清空 token
        //     localStorage.removeItem('token');
        //     // 强制跳转到登录页面
        //     location.href = "/login.html";
        // }   
        // }
    });
};

// 渲染头像函数
const randerAvatar = (user) => {
    // 获取名字
    const name = user.nickname || user.username;
    console.log(name);
    // 设置欢迎文本
    $('#welcome').html(`欢迎 ${name}`);
    // 按照需要渲染头像
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        const firstName = name[0].toUpperCase()
        $('.text-avatar').html(firstName).show();
    }
}