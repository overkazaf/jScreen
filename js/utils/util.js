/**
 * 
 * @authors John Nong (overkazaf@gmail.com)
 * @date    2015-04-12 13:02:47
 * @version $Id$
 */
 function log(k,v){
 	if (console && console.log) {
 		v && console.log(k, v);
 		console.log(k);
 	}
 }

