
function checkPhone(str) {
  var re = /^1[3|4|5|7|8][0-9]{9}$/;
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}

function checkEmail(str) {
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}

function checkUserName(str) {
  var re = /^\S{4,20}$/
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}

function checkPassWorld(str) {
  var re = /^\S{6,12}$/
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}

//将datetime转为正常的年月日时分秒
function timeTrans(val) {
  if (val != null && val != "") {
    var rowTime = new Date(val);
    return rowTime.getFullYear() + "-" + ((rowTime.getMonth() + 1) < 10 ? ("0" + (rowTime.getMonth() + 1)) : (rowTime.getMonth() + 1)) + "-" +         (rowTime.getDate() < 10 ? ("0" + rowTime.getDate()) : rowTime.getDate()) + " " + (rowTime.getHours() < 10 ? ("0" + rowTime.getHours()) : rowTime.getHours()) + ":" + (rowTime.getMinutes() < 10 ? ("0" + rowTime.getMinutes()) : rowTime.getMinutes()) + ":" + (rowTime.getSeconds() < 10 ? ("0" + rowTime.getSeconds()) : rowTime.getSeconds());
  } else {
    return "";
  }
}

//丹青点数status替换中文  (暂时只支持小程序的1-5状态)
function changeDotNumToCHN(val) {
  if (val == 1) {
    return '进行中';
  } else if (val == 2) {
    return '已结束';
  } else if (val == 3) {
    return '待交终稿';
  } else if (val == 7) {
    return '已打款';
  } else {
    return '待开票';
  }
}

//&nbsp替换成空格
function formatStr(str) {
  str = str.replace(/&nbsp;/g, " ");
  str = str.replace(/<br>/g, " ");
  return str
}

//保留两位小数位
function decimalFormat(val) {
    if(val != null) {
        var valStr = "" + val;
        if(valStr.indexOf(".") == -1) {
          valStr = valStr + ".00";
        }else {
          var dotPos = valStr.indexOf(".");
          var valStr1 = valStr.substring(0,dotPos);
          var valStr2 = valStr.substring(dotPos+1);
          if(valStr2.length == 1) {
            valStr2 = valStr.substring(dotPos + 1) + "0";
          }else if(valStr2.length == 2){
            
          }else {
            return parseFloat(valStr).toFixed(2);
          }
          valStr = valStr1 + "." + valStr2;
        }
        return valStr;
    }else {
        return "";
    }
}

function isBlank(val) {
  if (val == '' || val == null || val == undefined) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  checkPhone: checkPhone,
  checkEmail: checkEmail,
  checkUserName: checkUserName,
  checkPassWorld: checkPassWorld,
  timeTrans: timeTrans,
  changeDotNumToCHN: changeDotNumToCHN,
  formatStr: formatStr,
  decimalFormat: decimalFormat,
  isBlank: isBlank
}
