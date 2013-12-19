var RingFactorField = require('./ringfactorfield').RingFactorField
var RingFactorFieldMember = RingFactorField.prototype.member
var GF2PolyRing = require('./gf2polyring').GF2PolyRing
var FieldPolyRing = require('./fieldring').FieldPolyRing

var ring0 = new GF2PolyRing()

// This field is large enough to encode up to 90 characters of message. When base64 encoded,
// it comes to about 121 characters. Adding
var field = new RingFactorField(ring0, new ring0.member({'elements': [735,44,0]})) 


var ring = new FieldPolyRing(field)
var zero = ring.zero
var one  = ring.one

var SecretShare = function(id, n, x, y) {
    this.id = id
    this.n = n
    this.x = x
    this.y = y
}

SecretShare.prototype.toString = function() {
    return [this.id, this.n, this.x, this.y.toHex()].join(",")
}


var SecretSharer = function() {
}

SecretSharer.prototype.parse_secret = function(s) {
    ss = s.split(',')
    return new SecretShare(ss[0]. 
			   parseInt(ss[1]),
			   parseInt(ss[2]),
			   field.parse(ss[3]))
}

SecretSharer.prototype.deal = function(id, secret, n, k) {
    // generate k shares of which you need n to recreate the secret
    
    var x = [ field.encodeInt( 0 ) ]
    var y = [ field.encodeString( secret ) ]
    
    for(var i=1; i<n; ++i) {
	x.push( field.encodeInt(i) )
	y.push( field.random() )
    }

    var poly = ring.interpolate(x,y)

    var results = []
    for(i=0; i<k; ++i) {
	results.push( new SecretShare(id,n,i+1,poly.eval( field.encodeInt(i+1) ) ) )
    }
    
    return results
}

SecretSharer.prototype.reveal = function(shares) {
    var id = shares[0].id
    var n = shares[0].n
    var x = [field.encodeInt(shares[0].x)]
    var y = [shares[0].y]

    if (shares.length < n) {
	throw "not enough shares"
    }

    for(var i=1;i<shares.length;++i) {
	if(shares[i].id != id) {
	    throw "not all the same id"
	}

	x.push(field.encodeInt(shares[i].x))
	y.push(shares[i].y)
    }
    
    var poly = ring.interpolate(x,y)
    console.log(poly.eval(field.zero).value.order)
    return poly.eval(field.zero).decodeString()
}


//var s = new SecretSharer()
//var r = s.deal("test1", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5, 10)

//for(var i=0; i<r.length;++i) {
//    console.log( r[i].toString())
//}

//var reconst = s.reveal( r.slice(3,8) )
//console.log(reconst)

exports.SecretSharer = SecretSharer
