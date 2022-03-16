const POPUP_WIDTH = 280;
var ActivityShell = (function () {
  return {
    Init: function () {
      $(".wrapper").css({
        "height": window.innerHeight + "px"
      })
      var deviceType = ActivityShell.DeviceType();
      $(".wrapper").attr("device",deviceType);
      if(this.IsIOSDevice()){
        $("body").attr("platform","ios")
      }
      else{
        if(deviceType == "desktop"){
          $(".wrapper").addClass("center-screen");
        }
      }
      if(deviceType=="mobile"){
        if (window.matchMedia("(orientation: portrait)").matches) {
          $("#bestviewed_popup_msg").show();
        }
        else{
          $("#bestviewed_popup_msg").hide();
        }
      }
      this.InitToolTip();
    },
    LaunchActivity: function () {
      $(".container-so.launch").fadeOut();
      $(".container-so.main").show();
      this.AdjustContainerHeight();
      ScreenSplitter.InitSplitter();
      //GuidedTour.Init();
      EvaluateAlgebraicExpressions.LaunchActivity();
      /* Scale Spring to fit */
      ScreenSplitter.ScaleToFit($("#split-0"));
      /* Scale Graph to fit */
      ScreenSplitter.ScaleToFit($("#split-1"));
    },
    AdjustContainerHeight: function () {
      $(".wrapper").css({
        "height": window.innerHeight + "px"
      });
      if ($(".container-so.main").is(":visible")) {
        var headerHt = $(".container-so.main .exp_header").outerHeight();
        var footerHt = $(".container-so.main .exp_footer").outerHeight();
        $(".exp_body_header").css({ "height": headerHt + "px" });
        $(".exp_body_footer").css({ "height": footerHt + "px" });
        var mainHt = $(".container-so.main").height();
        var deviceType = ActivityShell.DeviceType();
        if (deviceType != "mobile") {
        }
        else{
          $(".wrapper").attr("device","mobile");
          headerHt = 0;          
        }
        $(".exp_body_content").css({ "height": (mainHt - (headerHt + footerHt))});
      }
    },
    DeviceType: function () {
      /* This function needs changes in device detection logic 
      below code is not working for ipad it returns desktop */
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        if(window.screen.availWidth<530 || window.screen.availHeight<530){
          return "mobile";
        }
        else{
          return "tablet";
        }
      }
      else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
      }
      return "desktop";
    },
    AdjustSplitPanelsOnOpenPopup: function ($popup) {
      var deviceType = ActivityShell.DeviceType();
      if (deviceType != "mobile") {
        if ($("#split-main").length > 0) {
          var spltWdt = $(".wrapper").width();
          $("#split-main").css({ "width": spltWdt - POPUP_WIDTH });
        }
        // $popup.addClass("right_align_popup");
      }
    },
    AdjustSplitPanelsOnClosePopup: function ($popup) {
      var deviceType = ActivityShell.DeviceType();
      if (deviceType != "mobile") {
        $("#split-main").css({ "width": $(".wrapper").width()});
      }
    }, 
    
    AdjustSplitPanelsOnCloseCustomPopup: function () {
      var deviceType = ActivityShell.DeviceType();
      if (deviceType == "mobile") {
        $("#split-main").css({ "height": "100%" });
      }
    }, 
    TogglePopup: function($popup, $button){
      if (!$popup.is(":visible")) {
        $(".popup").hide();
        $(".active").removeClass("active")
        var deviceType = ActivityShell.DeviceType();
        if (deviceType == "mobile") {
          $(".cust-popup").hide();
        }
        $popup.fadeIn();
        $button.addClass("active");
        $("#OK_btn, #btn_reset, #explain_btn, #next_btn").attr("disabled","disabled");
      }
      else {
        $popup.hide();
        $button.removeClass("active");
        $("#OK_btn, #btn_reset, #explain_btn, #next_btn").removeAttr("disabled");
      }
      /* Scale Spring to fit */
      ScreenSplitter.ScaleToFit($("#split-0"));
      /* Scale Graph to fit */
      ScreenSplitter.ScaleToFit($("#split-1"));
    },
    
    OnOrientationChange: function(){      
      this.AdjustContainerHeight();
      ScreenSplitter.InitSplitter();
      if ($(".popup").is(":visible")) {
        this.AdjustSplitPanelsOnOpenPopup($(".popup:visible"));
      }
      /* Scale Spring to fit */
      ScreenSplitter.ScaleToFit($("#split-0"));
      /* Scale Graph to fit */
      ScreenSplitter.ScaleToFit($("#split-1"));
      var deviceType = ActivityShell.DeviceType();

      //update Activity view OnOrientationChange
      EvaluateAlgebraicExpressions.OnOrientationChange();
      
      if(deviceType=="mobile"){
        if (window.matchMedia("(orientation: portrait)").matches) {
          $("#bestviewed_popup_msg").show();
        }
        else{
          $("#bestviewed_popup_msg").hide();
        }
      }
    },
    IsIOSDevice: function(){
      if (/iPad|iPhone|iPod/.test(navigator.platform)) {
        return true;
      } else {
        return navigator.maxTouchPoints &&
          navigator.maxTouchPoints > 2 &&
          /MacIntel/.test(navigator.platform);
      }
    },
    OnWindowResize: function(){
      var deviceType = this.DeviceType();
      if(deviceType == "desktop"){
        this.AdjustContainerHeight();
        ScreenSplitter.InitSplitter();
        if ($(".popup").is(":visible")) {
          this.AdjustSplitPanelsOnOpenPopup($(".popup:visible"));
        }
        /* Scale Spring to fit */
      ScreenSplitter.ScaleToFit($("#split-0"));
      /* Scale Graph to fit */
      ScreenSplitter.ScaleToFit($("#split-1"));
      }
    },
    InitToolTip: function(){
      var deviceType = ActivityShell.DeviceType();
      if (deviceType == "desktop") {
        if(!this.IsIOSDevice()){
          $("button[data-toggle='tooltip']").tooltip({ boundary: 'window', container: $(".wrapper"), trigger: "hover" })
        }
      }
    }
  };
})();

$(document).ready(function () {
  ActivityShell.Init();
});
document.ontouchmove = function(event){
  event.preventDefault();
}

$(window).bind('orientationchange', function () {
  this.setTimeout(function () {
    ActivityShell.OnOrientationChange();
  }, 200);
});

$(window).resize(function() {
  ActivityShell.OnWindowResize();
});

$(document).on("click", "#btn_launch", function (event) {
  ActivityShell.LaunchActivity();
});
/*Common Popup*/
$(document).on("click", "#btn_sheet", function (event) {
  ActivityShell.TogglePopup($(".popup.worksheet"),$(this));
});
$(document).on("click", "#btn_info", function (event) {
  ActivityShell.TogglePopup($(".popup.info"), $(this));
});
$(document).on("click", "#btn_procedure", function (event) {
  ActivityShell.TogglePopup($(".popup.procedure"),$(this));
});

$(document).on("click", ".btn-close-popup", function (event) {
  $(this).closest(".popup").hide();
  $(".active").removeClass("active")
  ActivityShell.AdjustSplitPanelsOnClosePopup($(this).closest(".popup"));
  /* Scale Spring to fit */
  ScreenSplitter.ScaleToFit($("#split-0"));
  /* Scale Graph to fit */
  ScreenSplitter.ScaleToFit($("#split-1"));

  $("#OK_btn, #btn_reset, #explain_btn, #next_btn").removeAttr("disabled");

});
/*End Common Popup Script */