(function ($) {
  MAX_LENGTH = 2000,
  documentPreview = {
    defaultSettings: {
      doc: {
        id: null,
        repository: null,
        workspace: null,
        path: null,
        title: null,
        fileType: null,
        downloadUrl: null,
        openUrl: null,
        isWebContent: false
      },
      showComments: false,
      user: {
        username: null,
        fullname: null,
        avatarUrl: null,
        profileUrl: null
      },
      author: {
        username: null,
        fullname: null,
        avatarUrl: null,
        profileUrl: null
      },
      activity: {
        id: null,
        postTime: "",
        status: "",
        liked: null,
        likes: null
      },
      comments: null
    },
    settings: {},

    init: function (docPreviewSettings) {
      this.settings = $.extend(this.defaultSettings, docPreviewSettings);

      var promises = [];

      // if we miss author information, let's fetch them
      if(this.settings.author.username != null
        && (this.settings.author.fullname == null  || this.settings.author.avatarUrl == null || this.settings.author.profileUrl == null)) {
        promises.push(this.fetchAuthorInformation());
      }
      // if we miss current user information, let's fetch them
      if(this.settings.user.fullname == null  || this.settings.user.avatarUrl == null || this.settings.user.profileUrl == null) {
        promises.push(this.fetchUserInformation());
      }
      // if we don't have the number of likes, let's fetch it
      if(this.settings.activity.id != null && this.settings.activity.likes == null) {
        promises.push(this.fetchLikes());
      }

      var self = this;

      if(ES6Promise && !window.Promise ) {
        ES6Promise.polyfill();
      }

      // wait for all users info fetches to be complete before rendering the component
      Promise.all(promises).then(function() {
        self.render();
        self.show();
        self.loadComments();
      }, function(err) {
        // error occurred
      });
    },

    fetchUserInformation: function(callback) {
      var self = this;
      return $.ajax({
        url: "/rest/v1/social/users/" + eXo.env.portal.userName,
        cache: false
      }).done(function (data) {
        if (data.fullname != null) {
          self.settings.user.fullname = data.fullname;
        }
        if (data.avatar != null) {
          self.settings.user.avatarUrl = data.avatar;
        } else {
          self.settings.user.avatarUrl = "/eXoSkin/skin/images/system/SpaceAvtDefault.png";
        }
        self.settings.user.profileUrl = "/" + eXo.env.portal.containerName + "/" + eXo.env.portal.portalName + "/" + eXo.env.portal.userName;
      }).fail(function () {
        console.log("Can not fetch user information!");
      }).always(function () {
        if(typeof callback === 'function') {
          callback();
        }
      });
    },

    fetchAuthorInformation: function(callback) {
      var self = this;
      return $.ajax({
        url: "/rest/v1/social/users/" + self.settings.author.username,
        cache: false
      }).done(function (data) {
        if (data.fullname != null) {
          self.settings.author.fullname = data.fullname;
        }
        if (data.avatar != null) {
          self.settings.author.avatarUrl = data.avatar;
        } else {
          self.settings.author.avatarUrl = "/eXoSkin/skin/images/system/SpaceAvtDefault.png";
        }
        self.settings.author.profileUrl = "/" + eXo.env.portal.containerName + "/" + eXo.env.portal.portalName + "/" + self.settings.author.username;
      }).fail(function () {
        console.log("Can not fetch author information!");
      }).always(function () {
        if(typeof callback === 'function') {
          callback();
        }
      });
    },

    fetchLikes: function() {
      var self = this;
      return $.ajax({
        url: '/rest/v1/social/activities/' + this.settings.activity.id + '/likes'
      }).done(function (data) {
        if (data.likes != null) {
          self.settings.activity.likes = data.likes.length;
        }
        self.clearErrorMessage();
      }).fail(function () {
        self.settings.activity.likes = 0;
        self.showErrorMessage("${UIActivity.comment.canNotLoadLikes}");
      });
    },

    like: function(like) {
      var self = this;
      if(like) {
        return $.post('/rest/v1/social/activities/' + this.settings.activity.id + '/likes', {liker: eXo.env.portal.userName})
          .done(function (data) {
            self.settings.activity.liked = true;
            self.settings.activity.likes++;
            $('#documentPreviewContainer .nbOfLikes').html(self.settings.activity.likes);
            self.refreshLikeLink();
            self.clearErrorMessage();
          }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotLike}");
            console.log("Can not like document!");
          });
      } else {
        return $.ajax({
            type: 'DELETE',
            url: '/rest/v1/social/activities/' + this.settings.activity.id + '/likes/' + eXo.env.portal.userName
          }).done(function (data) {
            self.settings.activity.liked = false;
            self.settings.activity.likes--;
            $('#documentPreviewContainer .nbOfLikes').html(self.settings.activity.likes);
            self.refreshLikeLink();
            self.clearErrorMessage();
          }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotUnLike}");
            console.log("Can not delete like of document!");
          });
      }
    },

    refreshLikeLink: function() {
      var likeIcon = $('#documentPreviewContainer #previewLikeLink .uiIconThumbUp');
      if(this.settings.activity.liked == true) {
        likeIcon.addClass('uiIconBlue');
        likeIcon.removeClass('uiIconLightGray');
      } else {
        likeIcon.removeClass('uiIconBlue');
        likeIcon.addClass('uiIconLightGray');
      }
    },

    createSkeleton: function () {
      var docPreviewContainer = $("#documentPreviewContainer");

      if(docPreviewContainer.length == 0) {
        docPreviewContainer = $("<div />", {
          "id": "documentPreviewContainer",
          "class": "maskLayer"
        }).appendTo('body');
      }
      docPreviewContainer.hide();

      var cssClasses = '';
      if (this.settings.doc.fileType) {
        cssClasses = $.map(this.settings.doc.fileType.split(/\s+/g), function(type){return "uiIcon16x16" + type}).join(" ");            
      }
      var versionStyle = 'none';
      if (this.settings.version != null) {
        versionStyle = 'block';
      }
      docPreviewContainer.html(' \
        <div class="uiDocumentPreview" id="uiDocumentPreview"> \
          <div class="exitWindow"> \
            <a class="uiIconClose uiIconWhite" title="${UIActivity.comment.close}" onclick="documentPreview.hide()"></a> \
          </div> \
          <div class="uiDocumentPreviewMainWindow clearfix"> \
            <!-- doc comments --> \
            <div class="uiBox commentArea pull-right" id="$uicomponent.id"> \
              <div class="title">\
                <i class="' + cssClasses + '"></i>&nbsp;' + this.settings.doc.title + ' \
                <span class="label pull-right" style="display:' + versionStyle + ';">V' + (this.settings.version != null ? this.settings.version.number : '0') + '</span> \
              </div> \
              <div class="uiContentBox"> \
                <div class="highlightBox"> \
                  <div class="profile clearfix"> \
                    <a title="' + (this.settings.author.fullname != null ? this.settings.author.fullname : '') + '" href="' + this.settings.author.profileUrl + '" class="avatarMedium pull-left"><img alt="' + (this.settings.author.fullname != null ? this.settings.author.fullname : '') + '" src="' + this.settings.author.avatarUrl + '"></a> \
                    <div class="rightBlock"> \
                      <a href="' + this.settings.author.profileUrl + '">' + (this.settings.author.fullname != null ? this.settings.author.fullname : '') + '</a> \
                      <p class="dateTime">' + this.settings.activity.postTime + '</p> \
                      <p class="descript" title="activityStatus">' + (this.settings.activity.status != null ? this.settings.activity.status : '') + '</p> \
                    </div> \
                  </div> \
                </div> \
                <div class="actionBar clearfix "> \
                  <ul class="pull-right"> \
                    <li> \
                      <a href="#" id="previewCommentLink"> \
                        <i class="uiIconComment uiIconLightGray"></i>&nbsp;<span class="nbOfComments"></span> \
                      </a> \
                    </li> \
                    <li> \
                      <a href="javascript:void(0);" id="previewLikeLink" onclick="documentPreview.like(!documentPreview.settings.activity.liked)" rel="tooltip" data-placement="bottom" title="${UIActivity.label.Like}"> \
                        <i class="uiIconThumbUp uiIconLightGray"></i>&nbsp;<span class="nbOfLikes"></span> \
                      </a> \
                    </li> \
                  </ul> \
                </div> \
                <div class="alert alert-error" id="uiPreviewErrorMessage">\
                  <i class="uiIconError" id="uiPreviewErrorMessageIcon"></i>\
                  <span id="uiPreviewErrorMessageContent">Your email address is incorrect. Please try again!</span>\
                </div>\
                <div class="comments">\
                  <ul class="commentList"> \
                  </ul> \
                </div> \
                <div class="commentInputBox"> \
                  <a class="avatarXSmall pull-left" href="' + this.settings.user.profileUrl + '" title="' + this.settings.user.fullname + '"> \
                    <img src="' + this.settings.user.avatarUrl + '" alt="' + this.settings.user.fullname + '" /></a> \
                    <div class="commentBox"> \
                      <textarea id="commentInput" placeholder="${UIActivity.comment.placeholder}" cols="30" rows="10" id="commentTextAreaPreview" activityId="activityId" class="textarea"></textarea> \
                      <button class="btn pull-left btn-primary" rel="tooltip" data-placement="bottom" title="comment" id="CommentButton" disabled>${UIActivity.label.Comment}</button> \
                      <button class="btn pull-left" rel="tooltip" data-placement="bottom" title="cancel" id="CancelButton">${UIActivity.label.Cancel}</button> \
                    </div> \
                  </div> \
              </div> \
            </div> \
            <div class="resizeButton " id="ShowHideAll"> \
              <i class="uiIconMiniArrowLeft uiIconWhite"></i> \
              <i class="uiIconMiniArrowRight uiIconWhite"></i> \
            </div> \
            <div id="documentPreviewContent"' + (this.settings.doc.isWebContent == true ? ' class="uiPreviewWebContent"' : '') + '> \
              <div class="loading"> \
                <i class="uiLoadingIconMedium uiIconLightGray"></i> \
              </div>\
            </div>\
              <div id = "previewPopup" class="UIPopupWindow uiPopup UIDragObject NormalStyle" style="width: 560px; position: absolute; top: 30%; left: 30%; margin: 0 auto 20px; z-index: 1; max-width: 100%;display:none">\
              <div class="popupHeader ClearFix">\
                  <a id="previewPopupCloseIcon" class="uiIconClose pull-right" aria-hidden="true" ></a>\
                  <span class="PopupTitle popupTitle">Popup header</span>\
              </div>\
              <div class="PopupContent popupContent">\
                  <div class="form-horizontal resizable">\
                      <div class="popupContent">\
                      <span class="confirmationIcon contentMessage">Are you sure you want to delete this comment?</span>\
                   </div>\
                  </div>\
                  <div class="uiAction uiActionBorder">\
                      <button id="previewPopupDeleteButton" class="btn" onclick="" type="button">Delete</button>\
                      <button id="previewPopupCloseButton" class="btn" onclick="" type="button">Cancel</button>\
                  </div>\
              </div>\
              <span class="uiIconResize pull-right uiIconLightGray"></span>\
            </div>\
            \
            <!-- put vote area here --> \
            <div class="previewBtn"> \
              <div class="showComments"> \
                <a><i class="uiIconComment uiIconWhite"></i>&nbsp;${UIActivity.comment.showComment}</a> \
              </div> \
              <div class="openBtn"> \
                <a href="' + this.settings.doc.openUrl + '"><i class="uiIconGotoFolder uiIconWhite"></i>&nbsp;${UIActivity.comment.openInDocuments}</a> \
              </div> \
              <div class="downloadBtn"> \
                <a href="' + this.settings.doc.downloadUrl + '"><i class="uiIconDownload uiIconWhite"></i>&nbsp;${UIActivity.comment.download}</a> \
              </div> \
            </div> \
          </div> \
        </div>');
      $("#uiPreviewErrorMessage").hide();
      $("#uiPreviewErrorMessageIcon").click(function() {
          $("#uiPreviewErrorMessage").hide();
      });
      $("#previewPopupCloseIcon, #previewPopupCloseButton").click(function() {
        $("#previewPopup").hide();
      });
    },
    showErrorMessage: function(message) {
      $("#uiPreviewErrorMessageContent").html(message);  
      $("#uiPreviewErrorMessage").show();
    },
    clearErrorMessage: function() {
      $("#uiPreviewErrorMessageContent").html("");
      $("#uiPreviewErrorMessage").hide();
    },
    loadComments: function() {
      var self = this;
      if(this.settings.activity.id != null) {
        // load comments activity
        $.ajax({
          url: '/rest/v1/social/activities/' + this.settings.activity.id + '/comments?expand=identity',
          cache: false
        }).done(function(data) {
          self.clearErrorMessage();
          self.renderComments(data.comments);
          resizeEventHandler();
          self.clearErrorMessage();
        }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotLoadComments}");
            console.log("Can not load comments!");
        });
      } else {
        // load document comments
        $.ajax({
          url: '/rest/contents/comment/all?jcrPath=/' + this.settings.doc.repository + '/' + this.settings.doc.workspace + this.settings.doc.path,
          dataType: 'xml',
          cache: false
        }).done(function(data) {
          var promises = [];
          var comments = [];
          var commentorsUsernames = [];
          var commentors = [];
          $(data).find("comment").each(function() {
            var id = $(this).find("id").text();
            var commentor = $(this).find("commentor").text();
            var content = $(this).find("content").text();
            var date = $(this).find("date").text();
            // insert the comment as the first element since we want to display comments from the oldest to the
            // newest whereas the web service returns in the opposite order
            comments.unshift({
              id: id,
              poster: commentor,
              body: content,
              updateDate: date,
              identity: {
                profile: null
              }
            });
            // store commentors in an associative array to ensure uniqueness
            commentorsUsernames[commentor] = commentor;
          });

          // fetch all commentors profiles
          for(var key in commentorsUsernames) {
            if (commentorsUsernames.hasOwnProperty(key)) {
              promises.push($.ajax({
                url: '/rest/v1/social/users/' + key
              }).done(function (data) {
                commentors[data.username] = data;
              }));
            }
          }

          // launch commentors profiles fetches using promise to allow to launch them in parallel
          // and to wait for the end of all requests to continue
          Promise.all(promises).then(function() {
            // complete comments objects with commentors profiles
            $.each(comments, function(index, comment) {
              comment.identity.profile = commentors[comment.poster];
            });
            self.renderComments(comments);
          }, function(err) {
            // error occurred
          });
          resizeEventHandler();
          self.clearErrorMessage();
        }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotLoadComments}");
            console.log("Can not load comments!");
        });
      }
    },

    renderComments: function(comments) {
      var self = this;

      var commentsContainer = $('#documentPreviewContainer .commentArea .comments');
      var commentsHtml = '';
      if(comments != null && comments.length > 0) {
        $('#documentPreviewContainer .nbOfComments').html(comments.length);
        commentsHtml = '<ul class="commentList">';
        $.each(comments, function (index, comment) {
          var commenterProfileUrl = "/" + eXo.env.portal.containerName + "/" + eXo.env.portal.portalName + "/" + comment.identity.profile.username;
          var commenterAvatar = comment.identity.profile.avatar;
          if (commenterAvatar == null) {
            commenterAvatar = '/eXoSkin/skin/images/system/UserAvtDefault.png';
          }

          commentsHtml += '<li class="clearfix"> \
            <a class="avatarXSmall pull-left" href="' + commenterProfileUrl + '" title="' + comment.identity.profile.fullname + '"><img src="' + commenterAvatar + '" alt="" /></a> \
            <div class="rightBlock"> \
              <div class="tit"> \
                <a href="' + commenterProfileUrl + '" >' + comment.identity.profile.fullname + '</a> \
                <span class="pull-right dateTime">' + self.convertDate(comment.updateDate) + '</span> \
              </div> \
              <p class="cont">' + comment.body + '</p> \
            </div> \
          </li>';
        })
        commentsHtml += '</ul>';
      } else {
        $('#documentPreviewContainer .nbOfComments').html('0');
        commentsHtml = '<div class="noComment"> \
            <div class="info">${UIActivity.comment.noComment}</div> \
          </div>';
      }
      commentsContainer.html(commentsHtml);
      
    },
    
    convertDate: function(dateStr) {
      var postedTime = Date.parse(dateStr);
      
      var time = (new Date().getTime() - postedTime) / 1000;
      var value;
      if (time < 60) {
        return "${UIActivity.label.Less_Than_A_Minute}";
      } else {
        if (time < 120) {
          return "${UIActivity.label.About_A_Minute}";
        } else {
          if (time < 3600) {
            value = Math.round(time / 60);
            return "${UIActivity.label.About_?_Minutes}".replace("{0}", value);
          } else {
            if (time < 7200) {
              return "${UIActivity.label.About_An_Hour}";
            } else {
              if (time < 86400) {
                value = Math.round(time / 3600);
                return "${UIActivity.label.About_?_Hours}".replace("{0}", value);
              } else {
                if (time < 172800) {
                  return "${UIActivity.label.About_A_Day}";
                } else {
                  if (time < 2592000) {
                    value = Math.round(time / 86400);
                    return "${UIActivity.label.About_?_Days}".replace("{0}", value);
                  } else {
                    if (time < 5184000) {
                      return "${UIActivity.label.About_A_Month}";
                    } else {
                      value = Math.round(time / 2592000);
                      return "${UIActivity.label.About_?_Months}".replace("{0}", value);
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    postComment: function () {
      var self = this;
      var commentInput = $('#documentPreviewContainer #commentInput');
      if(commentInput != null && $.trim(commentInput.val())) {
        var commentContent = commentInput.val();
        if(this.settings.activity.id != null) {
           var postData = { poster : eXo.env.portal.userName , title : commentContent };
          // post comment on the activity
          return $.ajax({
            type: 'POST',
            url: '/rest/v1/social/activities/' + this.settings.activity.id + '/comments',
            data: JSON.stringify(postData),
            contentType: 'application/json'
          }).done(function (data) {
            self.loadComments();
            $('#documentPreviewContainer #commentInput').ckeditorGet().destroy(true);
            self.initCKEditor();
            self.clearErrorMessage();
          }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotAddComment}");
            console.log("Can not post comment!");
          });
        } else {
          // post comment on the document
          return $.ajax({
            type: 'POST',
            url: '/rest/contents/comment/add',
            data: 'jcrPath=/' + this.settings.doc.repository + '/' + this.settings.doc.workspace + this.settings.doc.path + '&comment=' + commentContent,
            contentType: 'application/x-www-form-urlencoded'
          }).done(function (data) {
            self.loadComments();
            self.clearErrorMessage();
          }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotAddComment}");
            console.log("Can not post comment!");
          });
        }
      }
    },

    deleteComment: function(commentId) {
      var self = this;

      if(this.settings.activity.id != null) {
        return $.ajax({
          type: 'DELETE',
          url: '/rest/v1/social/comments/' + commentId
        }).done(function (data) {
          self.loadComments();
          self.clearErrorMessage();
        }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotDeleteComment}");
            console.log("Can not delete comment!");
        });
      } else {
        return $.ajax({
          type: 'DELETE',
          url: '/rest/contents/comment/delete/?jcrPath=/' + this.settings.doc.repository + '/' + this.settings.doc.workspace + this.settings.doc.path + '&commentId=' + commentId
        }).done(function (data) {
          self.loadComments();
          self.clearErrorMessage();
        }).fail(function () {
            self.showErrorMessage("${UIActivity.comment.canNotDeleteComment}");
            console.log("Can not delete comment!");
        });
      }
    },

    render: function () {
      var self = this;

      this.createSkeleton();

      $(window).on('resize', resizeEventHandler);
      $(document).on('keyup', closeEventHandler);

      // Bind close event. Return body scroll, turn off keyup
      $(".exitWindow > .uiIconClose", $('#uiDocumentPreview')).click(function() {
        $('body').removeClass('modal-open');
        setTimeout(function() {
          $('body').css('overflow', 'visible');
          $(document).off('keyup', closeEventHandler);
          $(window).off('resize', resizeEventHandler);
        }, 500);
      });

      // Bind expanded/collapsed event
      var uiDocumentPreview = $('#uiDocumentPreview');
      $('.resizeButton .uiIconMiniArrowLeft, .resizeButton .uiIconMiniArrowRight', uiDocumentPreview).click(function() {
        uiDocumentPreview.toggleClass("collapsed");
        resizeEventHandler();
      });

      if(this.settings.activity.id != null) {
        // render like link and nb of likes
        this.refreshLikeLink();
        $('#documentPreviewContainer .nbOfLikes').html(this.settings.activity.likes);
      } else {
        // hide like link since there is no linked activity
        $('#documentPreviewContainer #previewLikeLink').hide();
      }
      
      this.initCKEditor();

      $('#CommentButton').on('click', function(event) {
        self.postComment();
      });

      $('#CancelButton').on('click', function(event) {
        $('.commentArea')[0].style.display = "none";
        $('#documentPreviewContent .UIResizableBlock')[0].style.display = "block";
        $('.previewBtn')[0].style.display = "block"
      });

      $('.showComments').on('click', function(event) {
        var $uiDocumentPreview = $('#uiDocumentPreview');
        var $commentArea = $('.commentArea', $uiDocumentPreview);
        var $commentList = $('.commentList', $commentArea);
        $('#cke_commentInput .cke_contents')[0].style.height = "100px";
        $('.commentArea')[0].style.height = $(window).height()-80 + "px";
        $('.commentArea')[0].style.display = "block";
        $('.previewBtn')[0].style.display = "none"
        $('#documentPreviewContent .UIResizableBlock')[0].style.display = "none";

      });

      var docContentContainer = $('#documentPreviewContent');

      $('.loading', docContentContainer).show();
      this.show();
      docContentContainer.load('/rest/private/contentviewer/' + this.settings.doc.repository + '/' + this.settings.doc.workspace + '/' + this.settings.doc.id, function() {
        $('.loading', docContentContainer).hide();
        resizeEventHandler();
      });
    },
    initCKEditor: function() {
        var commentInput = $('#documentPreviewContainer #commentInput');
        var extraPlugins = 'simpleLink,simpleImage,suggester';

        // TODO this line is mandatory when a custom skin is defined, it should not be mandatory
        CKEDITOR.basePath = '/commons-extension/ckeditor/';
        commentInput.ckeditor({
          customConfig: '/commons-extension/ckeditorCustom/config.js',
          extraPlugins: extraPlugins,
          typeOfRelation: 'mention_comment',
          spaceURL: this.settings.activity.spaceURL,
          on : {
            instanceReady : function ( evt ) {
              // Hide the editor toolbar
              $("#CommentButton").prop("disabled", true);
              $('#' + evt.editor.id + '_bottom').removeClass('cke_bottom_visible');

            },
            focus : function ( evt ) {
              // Show the editor toolbar, except for smartphones in landscape mode
              if ($(window).width() > 767 || $(window).width() < $(window).height()) {
                //$('#' + evt.editor.id + '_bottom').css('display', 'block');
                evt.editor.execCommand('autogrow');
                var $content = $('#' + evt.editor.id + '_contents');
                var contentHeight = $content.height();
                var $ckeBottom = $('#' + evt.editor.id + '_bottom');
                $ckeBottom[0].style.display = "block";
                $ckeBottom.animate({
                  height: "39"
                }, {
                  step: function(number, tween) {
                    $content.height(contentHeight - number);
                    if (number >= 9) {
                      $ckeBottom.addClass('cke_bottom_visible');
                    }
                  }
                });
              } else {
                $('#' + evt.editor.id + '_bottom').removeClass('cke_bottom_visible');
                $('#' + evt.editor.id + '_bottom')[0].style.display = "none";
              }
            },
            blur : function ( evt ) {
              // Hide the editor toolbar
              if ($(window).width() > 767 || $(window).width() < $(window).height()) {
                $('#' + evt.editor.id + '_contents').css('height', $('#' + evt.editor.id + '_contents').height() + 39);
                $('#' + evt.editor.id + '_bottom').css('height', '0px');
                $('#' + evt.editor.id + '_bottom').removeClass('cke_bottom_visible');
              }
            },
            change: function( evt) {
                var newData = evt.editor.getData();
                var pureText = newData? newData.replace(/<[^>]*>/g, "").replace(/&nbsp;/g,"").trim() : "";

                if (pureText.length > 0 && pureText.length <= MAX_LENGTH) {
                    $("#CommentButton").removeAttr("disabled");
                } else {
                    $("#CommentButton").prop("disabled", true);
                }
                
                if (pureText.length <= MAX_LENGTH) {
                    evt.editor.getCommand('simpleImage').enable();
                } else {
                    evt.editor.getCommand('simpleImage').disable();
                }
            },
            key: function( evt) {
                var newData = evt.editor.getData();
                var pureText = newData? newData.replace(/<[^>]*>/g, "").replace(/&nbsp;/g,"").trim() : "";
                if (pureText.length > MAX_LENGTH) {
                    if ([8, 46, 33, 34, 35, 36, 37,38,39,40].indexOf(evt.data.keyCode) < 0) {
                        evt.cancel();
                    }
                }
            }
          }
        });
    },
    show: function () {
      $('#documentPreviewContainer').show();
      $('body').css('overflow', 'hidden');
    },

    hide: function () {
      $('#documentPreviewContainer').hide();
      $('body').css('overflow', '');
    }

  };;

  // Bind Esc key
  var closeEventHandler = function(e) {
    $('#presentationMode').blur();
    if (e.keyCode == 27 && ("presentationMode" != e.target.id || $.browser.mozilla)) {
      $(".exitWindow > .uiIconClose", $('#uiDocumentPreview')).trigger("click");
    }
  }

  // Resize Event
  var resizeEventHandler = function() {
    // Calculate margin
    var pdfDisplayAreaHeight = window.innerHeight - 92;
    var $uiDocumentPreview = $('#uiDocumentPreview');
    $('#outerContainer', $uiDocumentPreview).height(pdfDisplayAreaHeight); // pdf viewer
    var $commentArea = $('.commentArea', $uiDocumentPreview);
    var $commentAreaTitle = $('.title', $commentArea);
    var $commentInputBox = $('.commentInputBox', $commentArea);
    var $commentList = $('.commentList', $commentArea);
    var $highlightBox = $('.highlightBox', $commentArea);
    var $actionBarCommentArea = $('.actionBar', $commentArea);
    var commentAreaHeight = window.innerHeight - 60;
    $commentArea.height(commentAreaHeight);
    if ($commentList[0]) {
      $commentList[0].style.maxHeight =  $(window).height() - 430 + "px";
    }
    $commentList.scrollTop(20000);

    // Media viewer, no preview file
    var $navigationContainer = $(".navigationContainer", $uiDocumentPreview);
    var $uiContentBox = $('.uiContentBox', $navigationContainer);
    var $video = $('.videoContent', $uiContentBox);
    var $flowplayerContentDetail = $('.ContentDetail', $uiContentBox);
    var $flowplayerPlayerContent = $('.PlayerContent', $flowplayerContentDetail);
    var $flowplayer = $('object', $flowplayerPlayerContent);
    var $flashViewer = $('.FlashViewer', $uiContentBox);
    var $embedFlashViewer = $('embed', $flashViewer);
    var $windowmediaplayer = $('#MediaPlayer1', $uiContentBox);
    var $embedWMP = $('embed', $windowmediaplayer);

    $navigationContainer.height(pdfDisplayAreaHeight);
    $uiContentBox.height(pdfDisplayAreaHeight);
    $flowplayerContentDetail.height(pdfDisplayAreaHeight);
    $flowplayerPlayerContent.height(pdfDisplayAreaHeight - 5);
    $flashViewer.height(pdfDisplayAreaHeight - 5);

    $flowplayer.css('max-width', $uiContentBox.width() - 2);
    $flowplayer.css('max-height', $uiContentBox.height() - 3);
    $flowplayer.css('width', '100%');
    $flowplayer.css('height', '100%');

    $video.css('max-width', $uiContentBox.width() - 2);
    $video.css('max-height', $uiContentBox.height() - 3);
    $video.css('width', '100%');
    $video.css('height', '100%');

    $windowmediaplayer.css('max-width', $uiContentBox.width() - 2);
    $windowmediaplayer.css('max-height', $uiContentBox.height() - 7);
    $windowmediaplayer.css('width', '100%');
    $windowmediaplayer.css('height', '100%');
    $embedWMP.css('width', '100%');
    $embedWMP.css('height', '100%')

    $embedFlashViewer.css('max-width', $uiContentBox.width() - 2);
    $embedFlashViewer.css('max-height', $uiContentBox.height() - 3);
    $embedFlashViewer.css('width', '100%');
    $embedFlashViewer.css('height', '100%');

    var $img = $('a > img', $uiContentBox);

    if ($img.length > 0) {
      $img.css('max-width', $uiContentBox.width() + 1);
      $img.css('max-height', $uiContentBox.height() + 1);
      $img.css('width', 'auto');
      $img.css('height', 'auto');
      $navigationContainer.css('overflow', 'hidden');
    }

    $('.uiPreviewWebContent', $uiDocumentPreview).height(pdfDisplayAreaHeight - 30) // webcontent
    var $EmbedHtml =  $('.EmbedHtml', $uiDocumentPreview);
    $EmbedHtml.height(pdfDisplayAreaHeight) // External embedded

    // Resize image flick
    $img = $('.uiDocumentPreviewMainWindow > .EmbedHtml > a > img');
    $img.css('max-width', $EmbedHtml.width());
    $img.css('max-height', $EmbedHtml.height());
  }

  return documentPreview;
})($);
