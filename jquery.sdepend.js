/* 
 * This file contains functions to help generate select elements dynamically
 * based on selections on the page most functions here require jquery (min version 1.7)
 * 
 */
var pathFirst = '../proc_data/';

    
(function($){
    
    /**
     *Function to call on element to effect dependency or data set.
     */    
    $.fn.sdepend = function(dsPath, params){
        //var keepSession = true;
        dsPath += $.tappend;
        var jsonData = $.getDSet(dsPath, params.imgLoad);
        if(params.subKey && params.subKey !== ''){
            jsonData = jsonData[params.subKey];
        }
        
        var tempData = $.procData(jsonData, params);
        var opts = $.prepOptions(tempData, params);
        $(this).html(opts);
        
        //if(keepSession)
            //$(this).change();
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
        
        if(cd && cd.keys)
            kc = cd.keys.length;
        
        $.each(data, function(k, v){              
            var check = eval($.getConditionStr(v, kc, cd));
            if(check){
                if(!params.optFields || params.optFields.length <= 0)
                    newObj.push(new $.OptObj(v, v));
                else if(params.optFields && params.optFields.length == 1)
                    newObj.push(new $.OptObj(v[params.optFields[0]], v[params.optFields[0]]));
                else
                    newObj.push(new $.OptObj(v[params.optFields[0]], v[params.optFields[1]])); 
            }            
        });
        return newObj;
    };
    
    
    /**
     *
     * Functions that prepare the various record sets
     * @param: data data to use in constructing the real dat subset
     * @param: params array containing values to check against
     * @return: opts option grup to be appended to a select elemnt on the page
     * this method reduces values needed
     */
    $.prepOptions = function(data, params){
        var opts = '<option value="none">Select One...</option>';
        $.each(data, function(k, v){
            var ct = '';
            if(params.autoSelect && params.autoSelect === true){
                ct = (v.val == params.autoValue) ? ' selected="selected"' : '';
            } 
            opts += '<option value="'+v.val+'" '+ct+'>'+v.text+'</option>';
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
    
    $.tappend = '?tmt='+new Date().getTime();
    
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
