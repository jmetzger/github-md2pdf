'use strict'

/**
 * Rewrite the anchor links, so that they fit for markdown documents   
 **/

function rewriteAnchorJumper(p_str) {

    p_str = p_str.toLowerCase()
    p_str = p_str.replace(/ /g, '-')
    p_str = p_str.replace(/[?/()*]/g, '')
    return p_str
}

/**
 * Simply takes a _link which comes from the agenda
 * and rewrites it that it has a # - jumper 
 * content will in the end be on the same page
 **/

function rewriteAgendaLink(_line) {

    if (_line.substring(5, 8) == "* [") {
        let _linkSplit = _line.substring(8).trim().split(']')

        /**
         * the old link  
         * - we eventually want to rewrite 
         **/
        let _linkString = _linkSplit[1].substring(1).slice(0, -1)

        if (_linkSplit[1].substring(1, 5) == 'http') {
            return {
                link: _line.substring(0, 8) + _linkSplit[0] + '](' + _linkString + ')'
            }
        }

        /**
         * Provide more data, if it is an anchor  
         **/
        let _anchor = '#' + rewriteAnchorJumper(_linkSplit[0]) // linktext is used to produce anchor 
        let _ret = {
           link: _line.substring(0,8) + _linkSplit[0] + '](' + _anchor + ')',
           fromUrl: _linkString, 
           toUrl: _anchor 
        } 
        return _ret 
    }
    return {
      link: _line
    }
}

module.exports = {
    rewriteAnchorJumper: rewriteAnchorJumper,
    rewriteAgendaLink: rewriteAgendaLink
}
