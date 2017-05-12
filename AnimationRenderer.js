/**
 * A canvas animation pre-renderer.
 *
 * It renders an image sequence on a canvas and buffers the images into an array of base64 image data.
 *
 * @author Ikaros Kappler
 * @date   2017-04-14
 * @vesion 1.0.0
 **/

window.AnimationRenderer = (function() {

    // The constructor.
    var AnimationRenderer = function( canvasOrID,
				      fieldName,
				      rowName,
				      startValue,
				      stepCount,
				      step,
				      fps,
				      renderFunction
				    ) {

	console.debug( 'type='+(typeof canvasOrID) + ', fieldName=' + fieldName );
	if( typeof canvasOrID == 'string' )
	    canvasOrID = document.getElementById(canvasOrID);

	if( !canvasOrID )
	    throw "Canvas not found";

	this.canvas           = canvasOrID;
	this.fieldName        = fieldName;
	this.rowName          = rowName;
	this.startValue       = startValue;
	this.stepCount        = stepCount;
	this.step             = step;
	this.fps              = fps;
	this.renderFunction   = renderFunction;

	this.buffer           = [];
	this.currentStepIndex = 0;
	
	this.exports            = this;
	this.exports.renderNext = renderNext;
    };

    var renderNext = function() {
	console.log( 'Calculating next render values: ' + this.currentStepIndex );
	// Render next image
	var canvas = this.canvas.cloneNode();
	var value  = this.startValue + this.currentStepIndex*this.step;
	if( this.currentStepIndex >= this.stepCount )
	    return null;
	this.currentStepIndex++; 
	
	var imageData = this.renderFunction( value, this.currentStepIndex );
	this.buffer.push( imageData );

	return this.buffer[ this.buffer.length-1 ];
    };
    
    return AnimationRenderer;

})();



$( document ).ready( function() {

    var rend          = null;
    var stopRequested = false;
    var resetRenderer = function() {
	rend = new AnimationRenderer( 'my_canvas',
				      document.getElementById('field_name').value,
				      document.getElementById('row_name').value,
				      getFloatInput('from_value'),
				      getIntegerInput('step_count'), 
				      getFloatInput('step'),
				      getFloatInput('fps'),
				      function(value,index) {
					  // Store value into matrix
					  console.log( 'render value: '+value+', index='+index);
					  var matrix = mkFernMatrix();
					  collectMatrixInput(matrix);
					  var col = locateMatrixColumn( rend.fieldName );
					  var row = locateMatrixRow( rend.rowName );
					  console.debug( 'col=' + col + ', row=' + row );
					  matrix[row][col] = value;
					  document.getElementById('render_value').innerHTML = value.toPrecision(2);
					  document.getElementById('render_index').innerHTML = index;
					  pBarnsleyFern_canvas( 'my_canvas', document.getElementById('iterations').value, matrix );
					  return rend.canvas.toDataURL('image/png');
				      }
				    );
    }
    resetRenderer();
    var renderNext = function() {
	var renderData = null;
	console.log( 'Render data ...' );
	return rend.renderNext();
    };
    var startRenderAll = function() {
	document.getElementById('overlay').style.display = 'inherit';
	stopRequested = false;
	resetRenderer();
	renderAll(); 
    };
    var renderAll = function() {
	if( stopRequested ) {
	    document.getElementById('overlay').style.display = 'none';
	    return;
	}
	var renderData = renderNext();
	if( renderData )
	    window.setTimeout( renderAll, 10 );
	else
	    document.getElementById('overlay').style.display = 'none';
    };
    var cancelRender = function() {
	stopRequested = true;
    };
    var play = function( index ) {
	if( typeof index == 'undefined' ) index = 0;
	//console.debug( 'Available rendered images: ' + rend.buffer.length + ', next image: ' + index );
	if( index < rend.buffer.length ) {
	    //console.debug( 'Playing image '+index+' ...' );
	    document.getElementById('animation_preview').src = rend.buffer[index];
	    window.setTimeout( function() { play(index+1); }, 1000/rend.fps );
	}
    };
    document.getElementById('render_next').addEventListener( 'click', renderNext );
    document.getElementById('render_all').addEventListener( 'click', startRenderAll );
    document.getElementById('play').addEventListener( 'click', function() { play(0); } );
    document.getElementById('reset').addEventListener( 'click', resetRenderer );
    document.getElementById('cancel_render').addEventListener( 'click', cancelRender );
} );
