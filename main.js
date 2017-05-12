/**
 * @author   Ikaros Kappler
 * @date     2017-03-24
 * @modified 2017-04-14 (Animation Renderer added).
 * @version  1.0.0
 **/

var fernMatrix = mkFernMatrix();
function update() {
    pBarnsleyFern_canvas('my_canvas', $('input#iterations').val(), fernMatrix);
    //pBarnsleyFern_svg('my_canvas',100000);
}

$( document ).ready( function() {

    var labels = [ 'Stem', 'Successively smaller leaflets', 'Largest left-hand leaflet', 'Largest right-hand leaflet' ]
        
    var $tableBody = $( 'table#matrix_input tbody' );
    var populateMatrixInput = function( matrix ) {
	for( var r = 0; r < matrix.length; r++ ) {
	    var $row = $( '<tr/>' );
	    $row.append( $( '<td/>' ).html( 'f<sub>'+r+'</sub>' ) );
	    for( var c = 0; c < matrix[r].length; c++ ) {
		var $cell = $( '<td/>' );
		var $input = $( '<input/>', { type : 'number',
					      step : 0.05,
					      id : 'matrix_input_'+r+'_'+c
					    } )
		    .val( matrix[r][c] )
		    .data( 'r', r )
		    .data( 'c', c )
		    .change( function(e) {
			var $input = $( e.target );
			console.log( 'new value [c='+$input.data('c')+', r=' + $input.data('r') + ']=' + $input.val() );
			matrix[ $input.data('r') ][ $input.data('c') ] = parseFloat($input.val());
			update();
		    } );
		$cell.append( $input );
		$row.append( $cell );
	    }
	    $row.append( $( '<td/>' ).html( labels[r] ) );
	    $tableBody.append( $row );
	}
    };
    
    
    populateMatrixInput(fernMatrix);

    $( 'input#iterations' ).change( update );
    
    update();
} );


var collectMatrixInput = function( matrix ) {   
    for( var r = 0; r < matrix.length; r++ ) {
	for( var c = 0; c < matrix[r].length; c++ ) {
	    matrix[r][c] = getMatrixInput(r,c); // $( 'input#matrix_input_'+r+'_'+c ).val();
	};
    }
}

var getMatrixInput = function( r, c ) {
    return parseFloat( $( 'input#matrix_input_'+r+'_'+c ).val() );
}

var getFloatInput = function(id) {
    return parseFloat( document.getElementById(id).value );
}

var getIntegerInput = function(id) {
    return parseInt( document.getElementById(id).value );
}

var columnNames = [ 'a', 'b', 'c', 'd', 'e', 'f', 'p' ];
var rowNames    = [ 'f0', 'f1', 'f2', 'f3' ];
function locateMatrixColumn( name ) {
    return columnNames.indexOf(name);
}
function locateMatrixRow( name ) {
    return rowNames.indexOf( name );
}
