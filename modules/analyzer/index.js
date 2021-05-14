'use strict'

/**
 * Little helper function to showCodeCounter
 **/

function showCodeCounter(p_docPath,p_return){

   if (p_return !== undefined 
      && p_return.codeCounter !== undefined
      && p_return.codeCounter % 2 == 1){
      console.log(`codeCounter for ${p_docPath} is: ${p_return.codeCounter}`)
   }
}



module.exports = {
    showCodeCounter: showCodeCounter
}
