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

/**
 * Returns true if code block is broken 
 * e.g. codeCounter -> odd (uneven) 
 **/

function isCodeBlockBroken(p_return){

   /**
    * No data returned, so probably not broken
    **/
   if (p_return === undefined){
      return false
   } 

   /**
    * No code counter, so not code block
    * - so it cannot be broken
    **/
   if (p_return.codeCounter === undefined){
      return false

   }

   /**
    * Code Counter is uneven, so it is broken 
    **/
   if (p_return.codeCounter % 2 == 1){
      return true 
   }

   return false
}


module.exports = {
    showCodeCounter: showCodeCounter,
    isCodeBlockBroken: isCodeBlockBroken
}
