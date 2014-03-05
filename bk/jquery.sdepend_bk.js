/* 
 * This file contains functions to help generate select elements dynamically
 * based on selections on the page most functions here require jquery (min version 1.7)
 * 
 */
var pathFirst = '../proc_data/';

    
(function($){
    
    
    $.fn.depend = function(dsPath, params){
        var oparams = params.depChecks;
        var jsonData = $.getDSet(dsPath, params.imgLoad);
        //console.log('JSON Data', jsonData);             
        //console.log('depChecks Params', oparams);             
        
        var tempData = $.procData(jsonData, oparams);
        var opts = $.prepOptions(tempData, oparams);
        //console.log('Select Options', opts);

        $(this).html(opts);
        return $(this);
    };
    
    
    $.fn.sdepend = function(dsPath, params){
        var jsonData = $.getDSet(dsPath, params.imgLoad);
        //console.log('JSON Data', jsonData);             
        //console.log('Other Params', oparams);             
        
        var tempData = $.procData(jsonData, params);
        var opts = $.sprepOptions(tempData, params);
        console.log('Temp Data', tempData);
        console.log('Select Options', opts);
        

        $(this).html(opts);
        return $(this);
    };
    
    
    /**
     *Function to extract required data from the whole dataset
     *@param: data the whole dataset from which to get a sub-dataset
     *@param: params the details to check against 
     */
    $.procData = function(data, params){
        var newObj = [];        
        var kc = 0;
        var cd = params.depChecks;
        
        if(cd.keys)
            kc = cd.keys.length;
        
        $.each(data, function(k, v){              
            var check = eval($.getConditionStr(v, kc, cd));
            if(check){
                newObj.push(new $.OptObj(v[params.optFields[0]], v[params.optFields[1]])); 
            }            
        });
        return newObj;
    };
    
    
    /**
     *Function to extract required data from the whole dataset
     *@param: data the whole dataset from which to get a sub-dataset
     *@param: checkDet the details to check against 
     */
    $.procDataOld = function(data, checkDet){
        var newObj = [];        
        var kc = 0;
        if(checkDet.keys)
            kc = checkDet.keys.length;
        //console.log('No. Keys Sent', kc, checkDet);
        
        $.each(data, function(k, v){            
            var evalStr = $.getConditionStr(v, kc, checkDet);
            //console.log('Eval Str', evalStr);
            //console.log('Testing', data);
              
            var check = eval(evalStr);
            //console.log('After Eval', check);
            if(check){
                newObj.push(new $.OptObj(v[checkDet.optFields[0]], v[checkDet.optFields[1]])); 
            }            
        });
        return newObj;
    };


    /**
     *
     * Functions that prepare the various record sets
     * @param: dat data to use in constructing the real dat subset
     * @param: dCheck array containing values to check against
     * @return: opts option grup to be appended to a select elemnt on the page
     */
    $.prepOptions = function(dat, dCheck){
        //console.log('Check Data: ', data);
        var opts = '<option value="none">Select One...</option>';
        $.each(dat, function(k, v){
            //console.log('Values', v);
            console.log('Check Vals', dCheck.depKV[0], v[dCheck.depKV[1]]);
            var chkTxt = '';
            if(dCheck.flag){
                chkTxt = (dCheck.depKV[1] == v[dCheck.depKV[0]]) ? ' selected="selected"' : '';
            }
             
            //console.log('Check Text', chkTxt);
            opts += '<option value="'+v.val+'" '+chkTxt+'>'+v.text+'</option>';
        });
        return opts;
    }
    
    
    /**
     *
     * Functions that prepare the various record sets
     * @param: data data to use in constructing the real dat subset
     * @param: params array containing values to check against
     * @return: opts option grup to be appended to a select elemnt on the page
     * this method reduces values needed
     */
    $.sprepOptions = function(data, params){
        var opts = '<option value="none">Select One...</option>';
        $.each(data, function(k, v){
            var ct = '';
            if(params.flag){
                ct = (v.val == params.dep) ? ' selected="selected"' : '';
                //var chkTxt = (v[dCheck.optFields[0]] == dCheck.dep) ? ' selected="selected"' : '';
            } 
            opts += '<option value="'+v.val+'" '+ct+'>'+v.text+'</option>';
        });
        return opts;
    }
    
    
    /**
     *
     * Functions that prepare the various record sets
     * @param: data data to use in constructing the real dat subset
     * @param: dCheck array containing values to check against
     * @return: opts option grup to be appended to a select elemnt on the page
     * this method reduces values needed
     */
    $.sprepOptionsOld = function(data, dCheck){
        //console.log('Check Data: ', data);
        var opts = '<option value="none">Select One...</option>';
        $.each(data, function(k, v){
            var chkTxt = '';
            if(dCheck.flag){
                chkTxt = (v.val == dCheck.dep) ? ' selected="selected"' : '';
                //var chkTxt = (v[dCheck.optFields[0]] == dCheck.dep) ? ' selected="selected"' : '';
            }          
            
            //console.log('Check Text', chkTxt);
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
        if(kc <= 0){
            evalStr = 'true';
        }
        else{
            var first = true;
            for(var i = 0; i < kc; i++){
                if(!first) {evalStr += ' && '};
                evalStr += "'"+val[checkDet.keys[i]]+"'" +' == '+ "'"+checkDet.vals[i]+"'";
                first = false;
            }
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
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            //cache: true,
            async: false,
            success: function(data) {
                mydata = data;
            },
            complete: function (dataResp) {
                //alert(data_resp.responseText);
                var toHide = $('#'+hideId);
                $('#'+hideId).hide();
                //console.log('Data fetch completed', hideId, toHide);
            }
        });
        return mydata;
    }
      
   
   /**
     *
     *Function to get data from source
     *@param: dsPath datasource path
     *@param: reqData info sent to the data source for dat rerieval
     *@param: hideId the id of the load image to hide
     */
    $.postDSet = function(dsPath, reqData, hideId){
        var mydata = null;
        $.ajax({
            type: "GET",
            url: dsPath,
            data: reqData,
            //contentType: "application/json; charset=utf-8",
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


})(jQuery)