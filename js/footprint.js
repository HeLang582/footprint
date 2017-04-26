/**
 * Created by asus on 2017/3/28.
 */
jQuery(document).ready(function ( $ ) {
//  瀑布流效果
    $(".photo-box").mpmansory(
        {
            childrenClass: 'item', // default is a div
            columnClasses: 'padding', //add classes to items
            breakpoints:{
                lg: 6,
                md: 6,
                sm: 4,
                xs: 4
            },
            distributeBy: { order: false, height: false, attr: 'data-order', attrOrder: 'asc' }, //default distribute by order, options => order: true/false, height: true/false, attr => 'data-order', attrOrder=> 'asc'/'desc'
            onload: function (items) {
                //make somthing with items
            }
        }
    );
    $(".article-photo").mpmansory(
        {
            childrenClass: 'item', // default is a div
            columnClasses: 'padding', //add classes to items
            breakpoints:{
                lg: 6,
                md: 6,
                sm: 12,
                xs: 12
            },
            distributeBy: { order: false, height: false, attr: 'data-order', attrOrder: 'asc' }, //default distribute by order, options => order: true/false, height: true/false, attr => 'data-order', attrOrder=> 'asc'/'desc'
            onload: function (items) {
                //make somthing with items
            }
        }
    );

    $("#afterLogin").hide();

//  判断用户是否已登录,如果已经登录过存在有session则直接显示
//     if("<%=(String)session.getAttribute('user')%>"=="login_success"){
//         alert("aaaa");
//         $("#loginModal .modal-header .close").click();
//         $("#beforeLogin").hide();
//         $("#afterLogin #welcome span").text("嗨! <%=(String)session.getAttribute("username")%> 您好！");
//         $("#afterLogin").show();
//     }

//  页面加载完成之后判断哪些是点过赞的哪些是没有点过赞的，点过的显示实心，没点过的默认空心
    $(".support[data-content='1'] span").each(function () {
        $(this).removeClass("glyphicon glyphicon-heart-empty").addClass("glyphicon glyphicon-heart")
    });

//  用户登录
    $("#loginSubmit").on('click', function () {
//            var loginFormData=new FormData();
//            loginFormData.append('userName',$('#userName').val());
//            loginFormData.append('password',$('#password').val());
        var $str = "userName=" + $('#userName').val() + "&" + "password=" + $('#password').val();
        console.log($str);
        //console.log(typeof loginFormData);
        console.log($('#userName').val());
        console.log($('#password').val());
        $.ajax({
            type: 'POST',
            url: 'http://192.168.20.88/class/index.php',
            data: $str,
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
//                processData:false,
            success: function (json) {
//                  输出查看是否已经获取到回调的值
                console.log(json.state);
                console.log(json.name);
                if (json.state == "success") {
                    $("#loginModal .modal-header .close").click();
                    $("#beforeLogin").hide();
                    $("#afterLogin #welcome span").text("嗨! " + json.name + " 您好！");
                    $("#afterLogin").show();
                }
                if (json.state == "error") {
                    alert("对不起, 登录失败!请重新登录...");
                }
            }
        }).fail(function (xhr, status, errorThrown) {
            alert("对不起, 登录失败!");
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    });

//  用户注册
    $("#registerSubmit").on('click', function () {
        var $registerStr = "username=" + $("#registModal input[name='username']").val() + "&" + "password=" + $("#registModal input[name='password']").val() + "&" + "phone=" + $("#registModal input[name='phone']").val() + "&" + "nickname=" + $("#registModal input[name='nickname']").val();
        console.log($registerStr);
        $.ajax({
            type: 'POST',
            url: 'http://192.168.20.88/class/register.php',
            data: $registerStr,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            success: function (json) {
                if (json.state == "success") {
                    alert("恭喜你注册成功！现在可以去登录了");
                    $("#registModal .modal-header .close").click();
                }
            }
        }).fail(function (xhr, status, errorThrown) {
            alert("对不起, 注册失败!");
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    });

//  安全退出(这里的内容替换成你现在正确的安全退出的内容)
    $(".exit").on('click', function () {
        $("#beforeLogin").show();
        $("#afterLogin").hide();
        $.get("在这里填上你要访问的URL");
//          清空session
        $.session.clear();
    })

//  点赞功能
    $(".support").each(function () {
        $(this).on('click', function () {
            var $content = $(this).attr("data-content");
            var $pointid = $(this).attr("data-pointid");
//              点赞
            if ($content == "0") {
                alert("我是点赞");
                var $support_data = "这里添加你想要传递的参数，形式和登录一样";
                console.log($support_data);//控制台查看参数
                $.ajax({
                    type: 'POST',
                    url: '这里添加点赞的时候处理的URL',
                    data: $support_data,
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded",
                    success: function (json) {
                        //                  输出查看是否已经获取到回调的值
                        console.log(json.state);
                        if (json.state == "success") {
                            $(".support[data-pointid=" + $pointid + "]").attr("data-content", "1");
                            $(".support[data-pointid=" + $pointid + "] span").removeClass("glyphicon glyphicon-heart-empty").addClass("glyphicon glyphicon-heart");
                        }
                        if (json.state == "error") {
                            alert("对不起, 点赞失败!请重试...");
                        }
                    }
                }).fail(function (xhr, status, errorThrown) {
                    alert("对不起, 点赞失败!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                });

            }
//              取消点赞
            else if ($content == "1") {
                alert("我是取消点赞");
                var $cancel_support_data = "这里添加你想要传递的参数，形式和登录一样";
                console.log($cancel_support_data);//控制台查看参数
                $.ajax({
                    type: 'POST',
                    url: '这里添加点赞的时候处理的URL',
                    data: $cancel_support_data,
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded",
                    success: function (json) {
                        //                  输出查看是否已经获取到回调的值
                        console.log(json.state);
                        if (json.state == "success") {
                            $(".support[data-pointid=" + $pointid + "]").attr("data-content", "0");
                            $(".support[data-pointid=" + $pointid + "] span").removeClass("glyphicon glyphicon-heart").addClass("glyphicon glyphicon-heart-empty");
                        }
                        if (json.state == "error") {
                            alert("对不起, 取消点赞失败!请重试...");
                        }
                    }
                }).fail(function (xhr, status, errorThrown) {
                    alert("对不起, 取消点赞失败!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                });
            }
        })
    });

//  用户评论
    $(".comment-toggle").on('click',function () {
        var $userid=$(this).attr("data-userid");
        var $pointid=$(this).attr("data-pointid");
        $("#userid").val($userid);
        $("#pointid").val($pointid);
    });

//  初始化上传图片插件
    $("#input-44").fileinput({
        language: 'zh', //设置语言
        showUpload: false, //是否显示上传按钮
        uploadUrl: "这里填上你的处理上传的函数",
//            deleteUrl:"处理删除的路径",
        uploadAsync: false, //默认异步上传
        maxFilePreviewSize: 10240,
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
        browseClass: "btn btn-default" //按钮样式
    });

//  点击提交热点时先提交图片，后提交表单内容
    $(".HotpointSubmit").on('click',function (event) {
        //event.preventDefault();//这是阻止表单提交的事件，测试的图片上传的时候可以用
        $("#input-44").fileinput("upload");
        setTimeout(function () {
            $("#Hotpoint_form").submit();
        },200)
    });

    //      选项卡点击效果
    $(".select-item li[data-target='ft-article']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".ft-article").show();
        $(".about-edit").hide();
        $(".photo-edit").hide();
        $(".map-box").hide();
    });
    $(".select-item li[data-target='about-edit']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".ft-article").hide();
        $(".about-edit").show();
        $(".photo-edit").hide();
        $(".map-box").hide();
    });
    $(".select-item li[data-target='photo-edit']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".ft-article").hide();
        $(".about-edit").hide();
        $(".photo-edit").show();
        $(".map-box").hide();
    });
    $(".select-item li[data-target='map-box']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".ft-article").hide();
        $(".about-edit").hide();
        $(".photo-edit").hide();
        $(".map-box").show();
    });

});