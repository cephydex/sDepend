/* 
 * This file contains functions to help generate select elements dynamically
 * based on selections on the page most functions here require jquery (min version 1.7)
 * 
 */
    
(function($){
    
    /**
     *Function to call on element to effect dependency or data set.
     */    
    $.fn.sdepend = function(dsPath, params){
        dsPath += $.tappend;
        var jsonData = null;
        var tempData = null;
        
        if(!params.fromQry || params.fromQry !== true){
            jsonData = $.hasSub(
                $.getDSet(dsPath, params.imgLoad), 
                params
            );
            tempData = $.procData(jsonData, params);
        }else{
            jsonData = $.hasSub(
                $.postDSet(dsPath, params.depChecks, params.imgLoad), 
                params
            );
            tempData = $.procPostData(jsonData, params);
        }  
          
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
     *Function to extract required data from the whole dataset
     *@param: data the whole dataset from which to get a sub-dataset
     *@param: params the details to check against 
     */
    $.procPostData = function(data, params){
        var newObj = [];        
        var kc = 0;
        var cd = params.depChecks;
        
        if(cd && cd.keys)
            kc = cd.keys.length;
        
        $.each(data, function(k, v){
            if(!params.optFields || params.optFields.length <= 0)
                newObj.push(new $.OptObj(v, v));
            else if(params.optFields && params.optFields.length == 1)
                newObj.push(new $.OptObj(v[params.optFields[0]], v[params.optFields[0]]));
            else
                newObj.push(new $.OptObj(v[params.optFields[0]], v[params.optFields[1]])); 
                        
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
    };
          
        
   /**
     *
     *Function to get data from source
     *@param: dsPath datasource path
     *@param: req info sent to the data source for dat rerieval
     *@param: hideId the id of the load image to hide
     */
    $.postDSet = function(dsPath, req, hideId){
        var mydata = null;
        var reqData = $.buildPostData(req);
        
        $.ajax({
            type: "POST",
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
    };
    

    /**
     *
     *Function to construct condition statemants for evaluation
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


    /**
     * Function to build array for use in query on server side script
     * @param: req req parameters
     */
    $.buildPostData = function(req){ 
         var pd = {};
         for(var i = 0; i < req.keys.length; i++){
             pd[req.keys[i]] = req.vals[i];
         }
         return pd;
     };
    
    
    /**
     * Function to extract sub dat from a dataset
     * @param: jsonData dat to extract from
     * @param: params params from which to get sub data key
     * 
     */
    $.hasSub = function(jsonData, params){
        //var jd = jsonData.slice();
        var jd = jQuery.extend(true, {}, jsonData);
        if(params.subKey && params.subKey !== ''){
            jd = jd[params.subKey];
        }
        return jd;
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
   
   


})(jQuery)