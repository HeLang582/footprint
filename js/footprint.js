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

    //  调用CheckLogin()方法判读是否登录
    var $state=CheckLogin();
    if ($state){

        $("#loginModal .modal-header .close").click();
        $("#beforeLogin").hide();
        $("#afterLogin #welcome span").text("嗨! Girl 您好！");
        $("#afterLogin").show();
    }
    if(!$state){

    }

//  页面加载完成之后判断哪些是点过赞的哪些是没有点过赞的，点过的显示实心，没点过的默认空心
    $(".support[data-content='1'] span").each(function () {
        $(this).removeClass("glyphicon glyphicon-heart-empty").addClass("glyphicon glyphicon-heart")
    });

//  用户登录
    $("#loginSubmit").on('click', function () {
//            var loginFormData=new FormData();
//            loginFormData.append('userName',$('#userName').val());
//            loginFormData.append('password',$('#password').val());
        var $str = "username=" + $('#username').val() + "&" + "password=" + $('#password').val();
        console.log($str);
        //console.log(typeof loginFormData);
        console.log($('#username').val());
        console.log($('#password').val());
        $.ajax({
            type: 'POST',
            url: 'login.do',
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
            url: 'regist.do',
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
        $.get("logout.do");
//          清空session
        $.session.clear();
    })

//  点赞功能
    $(".support").each(function () {
        $(this).on('click', function () {
            if(!$state){
                Redirect();
            }
            else {
                var $content = $(this).attr("data-content");
                var $pointid = $(this).attr("data-pointid");
                var $userid = $(this).attr("data-userid");
                //给传递后台的数据赋值，组成字符串
                var $support_data = "userid="+$userid+"&pointid="+$pointid;
                //控制台查看
                console.log($support_data);
                //获取到点赞人的文本
                var $comment_praise_str=$(".comment[data-pointid='"+$pointid+"'] .praised-name").html();
                console.log($comment_praise_str);
                //将文本转换为数组
                var $comment_praise_arr=$comment_praise_str.split(",");
                console.log($comment_praise_arr);
//              点赞
                if ($content == "0") {
                    alert("我是点赞");
                    $.ajax({
                        type: 'POST',
                        url: 'savegood.do',
                        data: $support_data,
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded",
                        success: function (json) {
                            //                  输出查看是否已经获取到回调的值
                            console.log(json.state);
                            console.log(json.nickname);
                            if (json.state == "success") {
                                $(".support[data-pointid=" + $pointid + "]").attr("data-content", "1");
                                $(".support[data-pointid=" + $pointid + "] span").removeClass("glyphicon glyphicon-heart-empty").addClass("glyphicon glyphicon-heart");
                                var praised_name="<a href='"+$userid+"'>"+json.nickname+"</a>";
                                $comment_praise_arr.push(praised_name);
                                if ($comment_praise_arr.length==1){
                                    $(".comment[data-pointid='"+$pointid+"'] .praised-name").html($comment_praise_arr[0]);
                                }
                                else {
                                    $(".comment[data-pointid='"+$pointid+"'] .praised-name").html($comment_praise_arr.join(","));
                                }
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
                    $.ajax({
                        type: 'POST',
                        url: 'deletegood.do',
                        data: $support_data,
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded",
                        success: function (json) {
                            //              输出查看是否已经获取到回调的值
                            console.log(json.state);
                            if (json.state == "success") {
                                $(".support[data-pointid=" + $pointid + "]").attr("data-content", "0");
                                $(".support[data-pointid=" + $pointid + "] span").removeClass("glyphicon glyphicon-heart").addClass("glyphicon glyphicon-heart-empty");
                                //对点赞人数组进行删除操作
                                var indexOf=null;
                                var praised_name="<a href='"+$userid+"'>"+json.nickname+"</a>";
                                for (var i=0;i<$comment_praise_arr.length;i++){
                                    if ($comment_praise_arr[i]==praised_name){
                                        indexOf=i;
                                        break;
                                    }
                                }
                                $comment_praise_arr.splice(indexOf,1);
                                console.log($comment_praise_arr);
                                if($comment_praise_arr.length==1)
                                {
                                    $(".comment[data-pointid='"+$pointid+"'] .praised-name").html($comment_praise_arr[0]);
                                }
                                else {
                                    $(".comment[data-pointid='"+$pointid+"'] .praised-name").html($comment_praise_arr.join(" ,"));
                                }
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
            }
        })
    });

//  用户评论前登录状态判断
    $(".comment-toggle").on('click',function () {
        if(!$state){
            Redirect();
        }
        else {
            $("#commentModal").modal("show");
            var $userid=$(this).attr("data-userid");
            var $pointid=$(this).attr("data-pointid");
            $("#userid").val($userid);
            $("#pointid").val($pointid);
        }
    });

    //  提交评论内容
    $("#commentSubmit").on('click',function () {
        var $comment_pointid=$("#pointid").val();
        var $comment_userid=$("#userid").val();
        var $comment_text=$("#comment_text").val();
        var $comment_submit_str= "ownerid="+$comment_userid+"&pointid="+$comment_pointid+"&comment="+$comment_text;
        console.log($comment_submit_str);
        var $appendElement="<div class='media'><div class='media-left'><a href='#'><img class='media-object comment-head' src='images/person1.jpg'></a></div><div class='media-body'><p>"+nickname+":"+$comment_text+"      刚刚</p></div></div>";
        $.ajax({
            type: 'POST',
            url: 'savecomment.do',
            data: $comment_submit_str,
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
            success: function (json) {
                //                  输出查看是否已经获取到回调的值
                console.log(json.state);
                if (json.state == "success") {
                    $("#comment_text").val("");
                    $("#commentModal .modal-header .close").click();
                    $(".comment[data-pointid='"+$comment_pointid+"'] .comment-content").append($appendElement);
                }
                if (json.state == "error") {
                    alert("对不起, 评论失败!请重试...");
                }
            }
        }).fail(function (xhr, status, errorThrown) {
            alert("对不起, 网络原因评论失败!");
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    });

//  初始化上传图片插件
    $("#input-44").fileinput({
        language: 'zh', //设置语言
        showUpload: false, //是否显示上传按钮
        uploadUrl: "fileup2.do",
//            deleteUrl:"处理删除的路径",
        uploadAsync: false, //默认异步上传
        maxFilePreviewSize: 10240,
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
        browseClass: "btn btn-default" //按钮样式
    });

//   创建热点前校验用户是否登录
    $(".createHotpointBtn").on('click',function () {
        if(!$state){
            Redirect();
        }
        else {
            $("#createHotpoint").modal('show');
        }
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

    //     朋友主页相关事件（判断是否已关注对方）
    $(".attention[data-content='1']").each(function () {
        $(this).addClass("attention-btn");
        $(this).text("已关注")
    });
    //     朋友主页（选项卡点击效果）
    $(".select-item li[data-target='friend-index']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".friend-index").show();
        $(".ft-article").hide();
        $(".photo-edit").hide();
        $(".map-box").hide();
    });
    $(".select-item li[data-target='friend-ft-article']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".friend-index").hide();
        $(".ft-article").show();
        $(".photo-edit").hide();
        $(".map-box").hide();
    });
    $(".select-item li[data-target='friend-photo-edit']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".friend-index").hide();
        $(".ft-article").hide();
        $(".photo-edit").show();
        $(".map-box").hide();
    });
    $(".select-item li[data-target='friend-map-box']").on('click', function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".friend-index").hide();
        $(".ft-article").hide();
        $(".photo-edit").hide();
        $(".map-box").show();
    });
    //    关注事件
    $(".attention").each(function () {
        $(this).on('click', function () {
            if(!$state){
                Redirect();
            }
            else {
                var $content = $(this).attr("data-content");
                var $staruserid = $(this).attr("data-staruserid");
                //给传递后台的数据赋值，组成字符串
                var $attention_data = "staruserid="+$staruserid;
                //控制台查看
                console.log($attention_data);
//              关注
                if ($content == "0") {
                    alert("我是关注");
                    $.ajax({
                        type: 'POST',
                        url: '',
                        data: $attention_data,
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded",
                        success: function (json) {
                            //   输出查看是否已经获取到回调的值
                            console.log(json.state);
                            if (json.state == "looksuccess") {
                                $(".attention[data-staruserid=" + $staruserid + "]").attr("data-content", "1");
                                $(".attention[data-staruserid=" + $staruserid + "]").addClass("attention-btn");
                                $(".attention[data-staruserid=" + $staruserid + "]").text("已关注");
                            }
                            if (json.state == "error") {
                                alert("对不起, 关注失败!请重试...");
                            }
                        }
                    }).fail(function (xhr, status, errorThrown) {
                        alert("对不起, 关注失败!");
                        console.log("Error: " + errorThrown);
                        console.log("Status: " + status);
                        console.dir(xhr);
                    });
                }
//              取消关注
                else if ($content == "1") {
                    alert("我是取消关注");
                    $.ajax({
                        type: 'POST',
                        url: '',
                        data: $attention_data,
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded",
                        success: function (json) {
                            //              输出查看是否已经获取到回调的值
                            console.log(json.state);
                            if (json.state == "unlooksuccess") {
                                $(".attention[data-staruserid=" + $staruserid + "]").attr("data-content", "0");
                                $(".attention[data-staruserid=" + $staruserid + "]").removeClass("attention-btn");
                                $(".attention[data-staruserid=" + $staruserid + "]").text(" + 关注");
                            }
                            if (json.state == "error") {
                                alert("对不起, 取消关注操作失败!请重试...");
                            }
                        }
                    }).fail(function (xhr, status, errorThrown) {
                        alert("对不起, 取消关注操作失败!");
                        console.log("Error: " + errorThrown);
                        console.log("Status: " + status);
                        console.dir(xhr);
                    });
                }
            }
        })
    });

   //     关注页面的推荐关注人个人信息字符串长度截取控制
    $(".friends-item-info span").each(function () {
        var info_str=$(this).text();
        if(info_str.length>11){
            $(this).text(info_str.substr(0,11)+"...")
        }
    });
    //    关注页面选项卡事件
    $(".friends-select div[data-target='friends-recommend']").on("click",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".friends-recommend").show();
        $(".his-friends").hide();
        $(".his-fans").hide();
    });
    $(".friends-select div[data-target='his-friends']").on("click",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".friends-recommend").hide();
        $(".his-friends").show();
        $(".his-fans").hide();
    });
    $(".friends-select div[data-target='his-fans']").on("click",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".friends-recommend").hide();
        $(".his-friends").hide();
        $(".his-fans").show();
    });
});



//  判断用户是否已登录,如果已经登录过存在有session则直接显示
function CheckLogin() {
    if(state=="login_success") {
        return true;
    }
    else {
        return false;
    }
}

//创建热点、评论、点赞操作前验证登录状态，未登录状态的重定向
function Redirect() {
    alert("您还没有登陆！请先登录！！！");
    $(".LoginBtn").click();
}