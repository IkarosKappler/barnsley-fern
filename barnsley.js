/**
 * A barnsley farn canvas implementation.
 *
 * Original algorithm found at
 *   https://rosettacode.org/wiki/Barnsley_fern#JavaScript
 * 
 * Barnsley fern fractal
 *    6/17/16 aev
 *
 * @modified 2017-03-28 by Ika (Added input params for the matrix).
 **/
function pBarnsleyFern_canvas(canvasOrId,lim,matrix) {

    console.log( 'matrix=' + JSON.stringify(matrix) );
    
    if(  typeof matrix == 'undefined' )
	matrix = mkFernMatrix();
    
    // DCLs
    var canvas = canvasOrId;
    if( typeof canvasOrId == 'string' )
	canvas = document.getElementById(canvasOrId);
    var ctx = canvas.getContext("2d");
    var w   = canvas.width;
    var h   = canvas.height;
    var x=0.,y=0.,xw=0.,yw=0.,r;
    // return random number 0..max-1
    function randgp(max) { return Math.floor(Math.random()*max); }
    /*function drawPixel(x,y,color) {
	ctx.fillStyle = color;
	ctx.fillRect( x*50+260,
		      -y*50+540,
		      1,1
		    );
    }*/
    // Clean canvas
    ctx.fillStyle="white";
    ctx.fillRect(0,0,w,h);
    // MAIN LOOP
    for( var i = 0; i < lim; i++ ) {
	r=randgp(100);
	if (r<=1) {
	    //ctx.fillStyle="green";
	    xw=matrix[0][0];
	    yw=matrix[0][3]*y;
	    //drawPixel(xw,yw,'green');
	    //continue;
	} else if (r<=8) {
	    //ctx.fillStyle="red";
	    xw=matrix[2][0]*x+matrix[2][1]*y;
	    yw=matrix[2][2]*x+matrix[2][3]*y+matrix[2][5];
	    //drawPixel(xw,yw,'red');
	    //continue;
	} else if (r<=15) {
	    //ctx.fillStyle="yellow";
	    xw=matrix[3][0]*x+matrix[3][1]*y;
	    yw=matrix[3][2]*x+matrix[3][3]*y+matrix[3][5];
	    //drawPixel(xw,yw,'yellow');
	    //continue;
	} else {
	    //ctx.fillStyle="blue";
	    xw=matrix[1][0]*x+matrix[1][1]*y;
	    yw=matrix[1][2]*x+matrix[1][3]*y+matrix[1][5];
	    //drawPixel(xw,yw,'blue');
	    //continue;
	}

	x=xw;
	y=yw;
	// Draw pixel
	ctx.fillStyle="green";
	ctx.fillRect( x*50+260,
		      -y*50+540,
		      1,1
		    );
		
	
  } //fend i
}

// The default fern matrix
function mkFernMatrix() {
    return [
	[0, 	0,	0,	0.16,	0,	0,	0.01],
	[0.85,	0.04,	-0.04,	0.85,	0,	1.60,	0.85],
	[0.20,	-0.26,	0.23,	0.22,	0,	1.60,	0.07],
	[-0.15,	0.28,	0.26,	0.24,	0,	0.44,	0.07]
    ];
}
