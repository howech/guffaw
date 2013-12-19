

var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

var base64encode = function(ints) {
    var j = 0
    var k = 0
    var l = 0
    result = []
    while(j<ints.length) {
	var index

	index = (ints[j] >>> k) & 63

	l = k + 6 - 32

	if(l<0) {
	    l = 0
	}

	var mask = (1<<l)-1
	    
	index &= ( 1 << (6-l) ) - 1
	index |= (ints[j+1] & mask) << (6-l)
		
	result.push(code[index])

	k += 6
	if(k>=32) {
	    k-=32
	    j+=1
	}
    }

    return result.join("")
}

var base64decode = function(c) {
    result = []
    
    for(var i=0; i<c.length; ++i) {
	var bits = code.indexOf(c[i])
	var j = (i*6) >> 5
	var k = (i*6) % 32
	var l = k + 6 - 32

	if(l < 0) {
	    l = 0
	}
	var mask = ((1<<l)-1) << (6-l)
	var top = (bits & mask) >> (6-l)
	var bot = (bits & ~mask)
	    
	result[j] |= (bot <<k)
	result[j+1] |= (top)

	result[j] = ~~result[j]

    }

    var x = result.pop()
    if(x!=0) {
	result.push(x)
    }

    return result
}

exports.decode = base64decode
exports.encode = base64encode
