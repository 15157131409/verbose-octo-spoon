$(function(){
    const layer =layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 模拟文件选择框  然后点击事件

$('#btnChooseImage').click(()=>{
    // 回调函数点击文件选择框
    $('#file').click()
})


// 设置图片
// 给文件选择框绑定 change 事件
$('#file').change((e)=>{
    // console.log(e.target.files);
    // 用户选择了文件就会触发这个事件，通过 e.target.files 获取用户选择文件列表
    let filelist = e.target.files;
    // 判断用户有没有传文件 filelist.length
    if(filelist.length === 0 ) return layer.msg("请选择文件上传")

    //1. 如果传了 就拿到 索引为0的那个   
    const file = e.target.files[0];

      // 2. 将文件，转化为路径
    const imgUrl = URL.createObjectURL(file)

     // 3. 重新初始化裁剪区域
    $image
    .cropper("destroy") // 销毁旧的裁剪区域
    .attr("src", imgUrl) // 重新设置图片路径
    .cropper(options); // 重新初始化裁剪区域
})


// 上传图片
$('#btnUpload').click((e) => {
     // 1、拿到用户裁切之后的头像
    // 直接复制代码即可
    const dataURL = $image.cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
    })
    .toDataURL("image/png");

    // 2.发送上传文件的请求
    $.ajax({
        type:'POST',
        url:"/my/update/avatar",
        data:{
            avatar:dataURL,
        },
        success: (res) => {
            if(res.status !== 0) return layer.msg('更新头像失败')
            layer.msg('更新头像成功');
            // 调用父级的getUserInfo
            window.parent.getUserInfo();
        },
    });
});
});