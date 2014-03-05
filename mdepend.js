/* 
 * This file contains functions to help generate select elements dynamically
 * based on selections on the page most functions here require jquery (min version 1.7)
 * 
 */
var pathFirst = '../proc_data/';

    
(function($){

    
    
    //$.fn.depend = function(elementId, dsPath, params){
    $.fn.depend = function(dsPath, params){
        var oparams = params.dChecks;

        var jsonData = $.getDSet(dsPath);
        //console.log('JSON Data', jsonData);             
        
        var tempData = $.procData(jsonData, oparams);
        var opts = $.prepOptions(tempData, oparams);
        console.log('Select Options', opts);

        $(this).html(opts);
        return $(this);
    };


    
    /**
     *Function to extract required data from the whole dataset
     *@param: data the whole dataset from which to get a sub-dataset
     *@param: checkDet the details to check against 
     */
    $.procData = function(data, checkDet){
        var newObj = [];
        var kc = checkDet.keys.length;
        
        $.each(data, function(k, v){            
            var evalStr = $.getConditionStr(v, kc, checkDet);
            //console.log('Eval Str', eStr);
              
            var check = eval(evalStr);
            //console.log('After Eval', check);
            if(check){
                newObj.push(new $.OptObj(v.entry_mode, v.entry_mode_desc)); 
            }            
        });
        return newObj;
    };


    /**
     *
     * Functions that prepare the various record sets
     * @param: data data to use in constructing the real dat subset
     * @param: dCheck array containing values to check against
     * @return: opts option grup to be appended to a select elemnt on the page
     */
    $.prepOptions = function(data, dCheck){
        //console.log('Check Data: ', data);
        var opts = '<option value="none">Select One...</option>';
        $.each(data, function(k, v){
            if(dCheck.flag)
                var chkTxt = (dCheck.depKV[0] == v[dCheck.depKV[1]]) ? ' selected="selected"' : '';
            opts += '<option value="'+v.val+'" '+chkTxt+'>'+v.text+'</option>';
        });
        return opts;
    }


    /**
     *
     *Function to construct if statemants for evaluation
     */
    $.getConditionStr = function(val, kc, checkDet){
        var evalStr = '';
        var first = true;
        for(var i = 0; i < kc; i++){
            if(!first) {evalStr += ' && '};
            evalStr += val[checkDet.keys[i]] +' == '+ checkDet.vals[i];
            first = false;
        }
        return evalStr;
    }


    //object model for subjects
    $.OptObj = function (val, text){
        this.val = val;
        this.text = text;
    };
    
    
    /**
    * Function to remove an object from an array using key name as search criterion
    * @param: arr array to manipulate
    * @param: attr attribute to check against
    * @param: value: value to check against
    * @return: tArr modified array copy
    */
   $.removeByAttr = function(arr, attr, value){
       var tArr = arr.slice();
       var i = tArr.length;
       while(i--){
          if(tArr[i] && tArr[i].hasOwnProperty(attr) && (arguments.length > 2 && tArr[i][attr] === value )){
              tArr.splice(i,1);
          }
       }
       return tArr;
   }
   
   
   /**
     *
     *Function to get data from source
     *@param: dsPath datasource path
     *@param: hideId the id of the load image to hide
     */
    $.getDSet = function(dsPath, hideId){
        var mydata = null;
        $.ajax({
            type: "GET",
            url: dsPath,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //cache: true,
            async: false,
            success: function(data) {
                mydata = data;
            },
            complete: function (data_resp) {
                //alert(data_resp.responseText);
                $('#'+hideId).hide();
            }
        });
        return mydata;
    }















/**
 *----------------------------------------------------------------------------------------------------------
 *------------------------------------------ OLD IMPLEMENTATIONS--------------------------------------------
 *----------------------------------------------------------------------------------------------------------
 */


    /**
     *Function to extract required data from the whole dataset
     *@param: data the whole dataset from which to get a sub-dataset
     *@param: checkDet the details to check against 
     */
    $.procData2 = function(data, checkDet){
        var newObj = [];
        var ck1 = checkDet.checkKey1;
        var cv1 = checkDet.checkVal1;
        
        var ck2 = checkDet.checkKey2;        
        var cv2 = checkDet.checkVal2;
        var kc = checkDet.keyCount;
        var optField = checkDet.optFields;
        console.log('Key Count', kc);
        
        $.each(data, function(k, v){
            //console.log('Echo K', k);
            if(v[ck1] == cv1 && v[ck2] == cv2){
                newObj.push(new $.OptObj(v[optField[0]], v[optField[1]])); 
            }            
        });
        return newObj;
    };

    /**
     *
     * Functions that prepare the various record sets
     * @param: data data to use in constructing the real dat subset
     * @param: dCheck array containing values to check against
     * @return: opts option grup to be appended to a select elemnt on the page
     */
    $.prepOptions2 = function(data, dCheck){
        //console.log('Check Data: ', data);
        var opts = '<option value="none">Select One...</option>';
        $.each(data, function(k, v){
            if(dCheck.flag)
                var chkTxt = (dCheck.optV == v[dCheck.optK]) ? ' selected="selected"' : '';
            opts += '<option value="'+v.val+'" '+chkTxt+'>'+v.text+'</option>';
        });
        return opts;
    }

    

   


})(jQuery)