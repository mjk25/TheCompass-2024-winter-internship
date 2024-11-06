// 테스트 케이스
console.log(isEmpty(null));                    // true
console.log(isEmpty({}));                      // true
console.log(isEmpty(0));                       // false
console.log(isEmpty(false));                   // false
console.log(isEmpty([{}, {a:[]}])) ;           // true
console.log(isEmpty({a: null, b: ''}));        // true


function isEmpty(value) {
    if (
        value == null ||
        typeof value == "undefined" ||
        value.length == 0
    ) return true;

    else if (typeof value == "object"){
        if (
            Object.keys(value).length == 0 ||
            Object.values(value).every(isEmpty) == 0
        )
        return true;
        
        return Object.values(value).every(val => 
            isEmpty(val)
        )   
    }
    else 
        return false;
}
