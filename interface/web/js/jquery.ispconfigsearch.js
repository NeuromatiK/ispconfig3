﻿/*
Copyright (c) 2012, ISPConfig UG
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of ISPConfig nor the names of its contributors
      may be used to endorse or promote products derived from this software without
      specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function($) {
	$.fn.ispconfigSearch = function(settings){

		var defaultSettings = {
			dataSrc: '',
			timeout: 500,
			minChars: 2,
			resultBox: '-resultbox',
			cssPrefix: 'gs-',
			fillSearchField: false,
			fillSearchFieldWith: 'title',
			resultsText: '$ of % results',
			noResultsText: 'No results.',
			displayEmptyCategories: false,
			runJS: true
		};
		
		var previousQ = '';
		var data;
		var settings = $.extend(defaultSettings, settings);
		settings.resultBox = $(this).attr('id')+settings.resultBox;
		
		$(this).attr('autocomplete', 'off');
		$(this).wrap('<div class="'+settings.cssPrefix+'container" />');
		$(this).after('<ul id="'+settings.resultBox+'" class="'+settings.cssPrefix+'resultbox" style="display:none;"></ul>');
		var searchField = $(this);
		var resultBox = $('#'+settings.resultBox);

		var timeout = null;
		searchField.keyup(function(event) {
			// 13 = enter, 9 = tab
			if (event.keyCode != 13 && event.keyCode != 9){
				// query value
				var q = searchField.val();
				
				if (settings.minChars > q.length || q == ''){
					resultBox.fadeOut();
					resetTimer(timeout);
				} else {
					if (timeout != null){
						resetTimer(timeout);
					}
					
					timeout = setTimeout(function(){
						searchField.addClass(settings.cssPrefix+'loading');

						// we don't have to perform a new search if the query equals the previous query
						previousQ = q;
						var queryStringCombinator = '?';
						if(settings.dataSrc.indexOf('?') != -1){
							queryStringCombinator = '&';
						}
						$.getJSON(settings.dataSrc+queryStringCombinator+"q="+q, function(data, textStatus){
							if (textStatus == 'success'){
								var output = '';
								var resultsFound = false;

								if($.isEmptyObject(data) === false){
									$.each(data, function(i, category){
										if (category['cdata'].length > 0){
											resultsFound = true;
										}
									});
								}

								if (!resultsFound){
									output += '<li class="'+settings.cssPrefix+'cheader"><p class="'+settings.cssPrefix+'cheader-title">'+settings.noResultsText+'</p><p class="'+settings.cssPrefix+'cheader-limit">0 results</p></li>';
								} else {
								
									$.each(data, function(i, category){
										
										if (settings.displayEmptyCategories || (!settings.displayEmptyCategories && category['cdata'].length != 0)){
											var limit = category['cheader']['limit'];
											var cnt = 0;

											output += '<li class="'+settings.cssPrefix+'cheader"><p class="'+settings.cssPrefix+'cheader-title">'+category['cheader']['title']+'</p><p class="'+settings.cssPrefix+'cheader-limit">'+settings.resultsText.replace("%", category['cheader']['total']).replace("$", (category['cheader']['limit'] < category['cdata'].length ? category['cheader']['limit'] : category['cdata'].length))+'</p></li>';

											var fillSearchFieldCode = (settings.fillSearchField) ? 'document.getElementById(\''+searchField.attr('id')+'\').value = \'%\';' : '';
											//var fillSearchFieldCode = 'document.getElementById(\''+searchField.attr('id')+'\').value = \'%\';';
											
											$.each(category['cdata'], function (j, item){
												if (cnt < limit){
													//var link = '<a href="'+((item['url'] != undefined) ? item['url'] : 'javascript:void(0);')+'" '+((item['onclick'] != undefined) ? ' onclick="'+fillSearchFieldCode.replace("%", ((settings.fillSearchField) ? item[settings.fillSearchFieldWith] : ''))+(settings.runJS ? item['onclick'] : '')+'"' : '')+((item['target'] != undefined) ? ' target="'+item['target']+'"' : '')+'>';
													var link = '<a href="'+((item['url'] != undefined) ? item['url'] : 'javascript:void(0);')+'" '+((item['onclick'] != undefined) ? ' onclick="'+fillSearchFieldCode.replace("%", item[settings.fillSearchFieldWith])+(settings.runJS ? item['onclick'] : '')+'"' : '')+((item['target'] != undefined) ? ' target="'+item['target']+'"' : '')+'>';

													output += '<li class="'+settings.cssPrefix+'cdata">'+link+"\n";
													output += '<table border="0" cellspacing="0" cellpadding="0" width="100%"><tr><td>';
													output += '<p>';
													output += (item['title'] != undefined) ? '<span class="'+settings.cssPrefix+'cdata-title">'+item['title']+"</span><br />\n" : '';
													output += (item['description'] != undefined) ? ''+item['description']+''+"\n" : '';
													output += '</p>'+"\n";
													output += '</td></tr></table>';
													output += '</a></li>'+"\n";
												}
												cnt++;
											});
										}
									});
								}

								resultBox.html(output).css({'position' : 'absolute', 'top' : searchField.position().top+searchField.outerHeight(), 'right' : '0'}).fadeIn();

								searchField.removeClass(settings.cssPrefix+'loading');
							}
						});
					}, settings.timeout);
				}
			}		
		});
		
		searchField.blur(function(){
			resultBox.fadeOut();
		});

		searchField.focus(function(){
			if (searchField.val() == previousQ && searchField.val() != ''){
				resultBox.fadeIn();
			} else if (searchField.val() != ''){
				searchField.trigger('keyup');
			}
		});

	};
	
	function resetTimer(timeout){
		clearTimeout(timeout);
		timeout = null;
	};
})(jQuery);