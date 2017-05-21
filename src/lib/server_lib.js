"use strict";

(function(){
    function isNumber(value){
        return typeof value === "number" && isFinite(value);
    }

    exports.isNumber = isNumber;
    
})();