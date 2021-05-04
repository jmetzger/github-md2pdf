'use strict'

/**
 * better versio
 **/
/**
 * Set vars 
 **/
var tmpFolder = 'tmp'
//const url = "https://github.com/jmetzger/2021-linux-basiswissen.git"
//const url = "https://github.com/jmetzger/2021-linux-individualtraining.git"
const url = "https://github.com/jmetzger/training-mariadb-komplettkurs.git"

function getSubpageAndTransform(p_path, p_content){

  try {
     let _lines = fs.readFileSync('' + tmpFolder + p_path, 'utf8').split('\n');
     var _codeCounter = 0  

     _lines.forEach(async function(_item, _index) {

     
       // get rid of first line 
       if ( _index > 0 && _item.substring(0,1) == '#' ){
          p_content.push('#' + _item)
       }
       else if ( _index > 0 ){
         p_content.push(_item)
       }
     
       // used for sanity checking 
       if (_index > 0 && _item.substring(0,3) == '```'){
         _codeCounter++
       }

     })
     p_content.push(_pageBreak)
     p_content.push('')
     return {codeCounter: _codeCounter}
     //return _ret

   } catch(e){


   }

}

function _rewriteAgendaLink(_line){

    if (_line.substring(5,8) == "* ["){
       let _linkSplit = _line.substring(8).trim().split(']')
 
       if ( _linkSplit[1].substring(1,5) == 'http'){
          _linkString=_linkSplit[1].substring(1).slice(0,-1)
          //return '     * ' + _linkString 
          return _line.substring(0,8)
                 + _linkSplit[0] + ']('
                 + _linkString + ')'

       }
       
       return _line.substring(0,8) 
              + _linkSplit[0] + '](#' 
              + _rewriteAnchorJumper(_linkSplit[0]) + ')'

    }
    return _line

}

function _rewriteAnchorJumper(p_str){

  p_str = p_str.toLowerCase()
  p_str = p_str.replace(/ /g,'-')
  p_str = p_str.replace(/[?/()*]/g,'')
  return p_str
}

/** 
 * Clone the repo  
 **/

const _pageBreak = '<div class="page-break"></div>'
const shell = require('shelljs')
var fs = require('fs');

shell.exec('git clone ' + url + ' ' + tmpFolder)
var lines = fs.readFileSync('' + tmpFolder + '/README.md', 'utf8').split('\n');
const { mdToPdf } = require('md-to-pdf');

/**
 * Now walk through the document and extract the head by getting a number
 **/

var _headSectionStart=0
var _headSectionStop=0

/**
 * First we want to find our headSection 
 **/

lines.forEach(async function(_item, index) {

   if ( _item.substring(0,9) == '## Agenda' ){
      _headSectionStop = index
   }

})

var _headSection = lines.slice(_headSectionStart, _headSectionStop)
var _agendaSectionStart = _headSectionStop + 1

/**
 * Currently we assume, there is only an Agenda on the README - page and nothing else 
 **/
var _agendaSectionStop = lines.length - 1 

/**
 * Construct Header  
 **/
var _headSection   = lines.slice(_headSectionStart,_headSectionStop)
var _agendaTitle = []
_agendaTitle.push('')
_agendaTitle.push('')
_agendaTitle.push('## Agenda')
var _agendaSectionOrig = lines.slice(_agendaSectionStart,_agendaSectionStop)
var _agendaSectionKeep = []

_agendaSectionOrig.forEach (async function(_line, index) {

   _agendaSectionKeep.push(_rewriteAgendaLink(_line))

})

_agendaSectionKeep.push('') // add new line 
_agendaSectionKeep.push(_pageBreak)
_agendaSectionKeep.push('')
_agendaSectionKeep.push('')


var _agendaSectionRewrite = lines.slice(_agendaSectionStart,_agendaSectionStop) 

/**
 * Rewrite:
 * 1) Walk trough array and identify lines with 1. 
 * 2) push 
 **/

var _contentSection = []
var _contentSubSection = []
var _linkString = ''

_agendaSectionRewrite.forEach (async function(_line, index) {

    if ( _line.substring(2,5) == '1. '){

       if (_contentSubSection.length > 0){
          /**
           * Walk through _contentSubSection and add every singe line to _contentSection 
           **/
           _contentSubSection.forEach (async function(_line, index) {
              _contentSection.push(_line)
           })
           _contentSubSection = []
       }

       _contentSection.push('## ' + _line.substring(5))
       _contentSection.push('')

    }

    if (_line.substring(5,8) == "* ["){
       //console.log ('subelement:' + _line.substring(8).trim() + ':found')
       let _linkSplit = _line.substring(8).trim().split(']')

       _contentSubSection.push('### ' + _linkSplit[0])
       _contentSubSection.push('')
 
       // if we detect an external link, we will simply present that one 
       // First line will be the link title as h3 - ### - header 
       if ( _linkSplit[1].substring(1,5) == 'http'){
          _linkString=_linkSplit[1].substring(1).slice(0,-1)
          _contentSubSection.push('  * ' + _linkString) 
          _contentSubSection.push('')

       }
       else if ( _linkSplit[1].substring(1,2) == "/"){
          
          // p_content will get referenced and changed
          let _docPath=_linkSplit[1].substring(1).slice(0,-1)
          let _return = getSubpageAndTransform(_docPath, _contentSubSection)
          showCodeCounter(_docPath,_return)


       } else { 
         /** file is probably in root-level **/
         let _docPath="/" + _linkSplit[1].substring(1).slice(0,-1)
         let _return = getSubpageAndTransform(_docPath, _contentSubSection)
         showCodeCounter(_docPath,_return)
         //console.log(`codeCounter for ${_docPath} is: ${_return.codeCounter}`)
       }
  

    }


})

/**
 * Add the last section  
 **/
    
if (_contentSubSection.length > 0){
   /**
    * Walk through _contentSubSection and add every singe line to _contentSection 
    **/
    _contentSubSection.forEach (async function(_line, index) {
      _contentSection.push(_line)
    })
    _contentSubSection = []
}


let _output,_outputPath 

_output  = _headSection.join('\n') 
_output += _agendaTitle.join('\n')
_output += _agendaSectionKeep.join('\n') 
_output += _contentSection.join('\n')

_outputPath = 'tmp/_README.md'
fs.writeFile(_outputPath, _output, function (err,data) {
  if (err) {
    return console.log(err);
  }
});


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
 * Create pdf 
 **/

(async () => {
  const pdf = await mdToPdf({ path: './tmp/_README.md' }, { dest: './tmp/README.pdf' }).catch(console.error);

  if (pdf) {
    fs.writeFileSync(pdf.filename, pdf.content);
  }
})();

