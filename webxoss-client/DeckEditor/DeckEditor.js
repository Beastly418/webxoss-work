"use strict";function callConstructor(e){var n=e.bind.apply(e,arguments);return new n}function applyToConstructor(e,n){var t=concat(null,toArr(n)),r=e.bind.apply(e,t);return new r}function nextTick(e){setTimeout(e,0)}function hide(e){e.style.display="none"}function show(e){e.style.display=""}function disable(e){e.disabled=!0}function enable(e){e.disabled=!1}function newElement(e){for(var n=document.createElement(e),t=1;t<arguments.length;t++)n.classList.add(arguments[t]);return n}function getImageUrlByPid(e){return imageManager.getUrlByPid(e)}function search(){var e=$("search-input").value;results=searcher.search(e),showResults()}function showResults(){_shown=0,$("search-list").innerHTML="",showMore()}function showMore(){for(var e=0;e<RESULTS_LENGTH;e++){var n=_shown;if(n>=results.length)break;var t=results[n],r=newElement("li"),c=new Image;c.src=getImageUrlByPid(t.pid),c.alt=Localize.cardName(t),c.title=Localize.cardName(t),c.onmousemove=showDetail.bind(null,t),c.onclick=addCardByInfo.bind(null,t,!1),r.appendChild(c),$("search-list").appendChild(r),_shown++}_shown<results.length?show($("search-show-more")):hide($("search-show-more"))}function showDetail(e){detail.show(e.pid)}function updateDeckList(){return $("select-decks").innerHTML="",deckNames=deckManager.getDeckNames(),deckNames.length?void deckNames.forEach(function(e){var n=newElement("option");n.textContent=e,$("select-decks").appendChild(n)},this):void createDeck("WHITE_HOPE",whiteHope)}function loadDeck(e){var n=deckManager.loadDeck(e);removeAllCards(mainData),n.mainDeck.forEach(function(e){var n=CardInfo[e];addCardByInfo(n,!0)}),removeAllCards(lrigData),n.lrigDeck.forEach(function(e){var n=CardInfo[e];addCardByInfo(n,!0)}),updateDeck(mainData),updateDeck(lrigData)}function saveDeck(e){deckManager.saveDeck(e,getCurrentDeck())}function createDeck(e,n){if(!e)return!1;var t=deckNames.indexOf(e);return t>=0?void selectDeck(t):(deckManager.createDeck(e,n||getCurrentDeck()),updateDeckList(),t=deckNames.indexOf(e),void selectDeck(t))}function deleteDeck(e){var n=deckIndex;deckManager.deleteDeck(e),updateDeckList(),n>=deckNames.length&&(n=deckNames.length-1),selectDeck(n)}function renameDeck(e){var n=deckName;createDeck(e),deleteDeck(n)}function selectDeck(e){deckIndex=e,deckName=deckNames[e],loadDeck(deckName),$("select-decks").selectedIndex=e}function getCurrentDeck(){var e={};return e.mainDeck=mainData.deckObjs.map(function(e){return e.info.pid}),e.lrigDeck=lrigData.deckObjs.map(function(e){return e.info.pid}),e}function dataToPids(e){return e.deckObjs.map(function(e){return e.info.pid})}function addCardByInfo(e,n){var t;t="LRIG"===e.cardType||"ARTS"===e.cardType||"RESONA"===e.cardType?lrigData:mainData,t.deckObjs.length>=t.limit||(t.deckObjs.push({idx:t.deckObjs.length,info:e,img:null}),n||(updateDeck(t),saveDeck(deckName)))}function removeCardByIndex(e,n,t){e.zone.removeChild(e.deckObjs[n].img),e.deckObjs.splice(n,1),updateDeck(e),t||saveDeck(deckName)}function removeAllCards(e){e.zone.innerHTML="",e.deckObjs.length=0}function updateDeck(e){defaultSort(e);var n,t,r=dataToPids(e);"main"===e.deck?(n=deckManager.checkMainDeck(r),t=$("main-deck-title"),$("main-deck-burst-count").textContent=deckManager.burstCount(r)):(n=deckManager.checkLrigDeck(r),t=$("lrig-deck-title")),n?t.classList.remove("invalid"):t.classList.add("invalid"),t=$("main-deck-mayus-room"),n=deckManager.checkMayusRoom(dataToPids(mainData).concat(dataToPids(lrigData))),n?t.classList.remove("invalid"):t.classList.add("invalid"),e.deckObjs.forEach(function(n,t){var r=n.info,c=n.img;c||(c=new Image,c.src=getImageUrlByPid(r.pid),c.alt=Localize.cardName(r),c.onmousemove=showDetail.bind(null,r),n.img=c,e.zone.appendChild(c)),c.onclick=removeCardByIndex.bind(null,e,t,!1),c.style.left=t%10*WIDTH+"px",c.style.top=Math.floor(t/10)*HEIGHT+"px"},this)}function defaultSort(e){e.deckObjs.sort(function(e,n){var t=e.info,r=n.info,c=e.idx,a=n.idx;if("LRIG"===t.cardType){if("LRIG"!==r.cardType)return-1;if(r.level!==t.level)return t.level-r.level}if("ARTS"===t.cardType&&"ARTS"!==r.cardType)return 1;if("RESONA"===t.cardType){if("LRIG"===r.cardType)return 1;if("ARTS"===r.cardType)return-1;if(r.level!==t.level)return t.level-r.level}if("SIGNI"===t.cardType){if("SIGNI"!==r.cardType)return-1;if(t.level!==r.level)return r.level-t.level;if(t.power!==r.power)return t.power-r.power}return"SPELL"===t.cardType&&"SPELL"!==r.cardType?1:t.cid!==r.cid?t.cid-r.cid:c-a}),e.deckObjs.forEach(function(e,n){e.idx=n})}function hideImpotExport(){hide($("div-import-warp"))}function deckToText(e){var n="",t=[e.lrigDeck,e.mainDeck.filter(function(e){var n=CardInfo[e];return!(n.burstEffectTexts&&n.burstEffectTexts.length)}),e.mainDeck.filter(function(e){var n=CardInfo[e];return n.burstEffectTexts&&n.burstEffectTexts.length})];return t.forEach(function(e,t,r){var c="",a=0;e.forEach(function(e,t,r){var i=CardInfo[e],o=Localize.cardName(i);o!==c&&0!==t?(n+=a+" "+c+"\n",c=o,a=1):(c=o,a++),t===r.length-1&&(n+=a+" "+c+"\n")},this),t!==r.length-1&&(n+="——————————\n")}),n}function deckToJson(e){var n={format:"WEBXOSS Deck",version:"1",content:e};return JSON.stringify(n)}function parseFile(e,n){if(!FileReader||e.size>1024)return void n(null);var t=new FileReader;t.onload=function(e){n(parseCode(t.result))},t.readAsText(e)}function parseCode(e){try{var n=JSON.parse(e),t="WEBXOSS Deck"===n.format&&1===+n.version&&n.content.mainDeck.length<=50&&n.content.lrigDeck.length<=20;return t?n.content:null}catch(e){return null}}var concat=Array.prototype.concat.bind([]),toArr=function(e){return e?"string"==typeof e?[]:Array.prototype.slice.call(e,0):[]},isArr=Array.isArray,inArr=function(e,n){return toArr(n).indexOf(e)!=-1},removeFromArr=function(e,n){var t=n.indexOf(e);return!(t<0)&&(n.splice(t,1),!0)},isStr=function(e){return"string"==typeof e},isObj=function(e){return e&&"object"==typeof e&&!isArr(e)},isNum=function(e){return"number"==typeof e},isFunc=function(e){return"function"==typeof e},pEach=function(e,n,t){return e.reduce(function(e,t){return e.then(function(){return n(t)})},Promise.resolve())},$=document.getElementById.bind(document);Localize.init(),Localize.DOM("DeckEditor"),window.searcher=new Searcher,window.imageManager=new ImageManager("../"),window.detail=new CardDetail(imageManager);var results=[],RESULTS_LENGTH=20,_shown=0;$("search-input").onchange=search,$("search-input").onkeyup=search,$("search-show-more").onclick=showMore;var WIDTH=62,HEIGHT=87,mainData={deck:"main",limit:50,deckObjs:[],zone:$("main-deck-zone")},lrigData={deck:"lrig",limit:20,deckObjs:[],zone:$("lrig-deck-zone")},deckManager=new DeckManager,deckNames=[],deckName="",deckIndex=-1,whiteHope={mainDeck:[112,113,114,115,116,117,118,119,120,121,112,113,114,115,116,117,118,119,120,121,112,113,114,115,116,117,118,119,120,121,112,113,114,115,116,117,118,119,120,121],lrigDeck:[104,105,106,107,108,109,110,111]};updateDeckList(),selectDeck(0);var emptyDeck={mainDeck:[],lrigDeck:[]};$("button-new-deck").onclick=function(e){return $("input-new-deck-name").value?(createDeck($("input-new-deck-name").value,emptyDeck),void($("input-new-deck-name").value="")):(window.alert(Localize.editor("PLEASE_INPUT_A_DECK_NAME")),void $("input-new-deck-name").focus())},$("button-copy-deck").onclick=function(e){return $("input-new-deck-name").value?(createDeck($("input-new-deck-name").value),void($("input-new-deck-name").value="")):(window.alert(Localize.editor("PLEASE_INPUT_A_DECK_NAME")),void $("input-new-deck-name").focus())},$("button-delete-deck").onclick=function(e){window.confirm(Localize.editor("CONFIRM_DELETE_DECK",deckName))&&deleteDeck(deckName)},$("select-decks").onchange=function(e){selectDeck($("select-decks").selectedIndex)},$("button-rename").onclick=function(e){var n=window.prompt(Localize.editor("DECK_NAME"),deckName);if(n&&n!==deckName)return inArr(n,deckNames)?void window.alert(Localize.editor("DECK_NAME_ALREADY_EXISTS",n)):void renameDeck(n)},$("button-import-export").onclick=function(e){show($("div-import-warp")),$("textarea-import-export").value=""},$("button-import-export-cancel").onclick=function(e){hideImpotExport()},$("button-text").onclick=function(e){var n=deckToText(getCurrentDeck());$("textarea-import-export").value=n,$("textarea-import-export").select()},$("button-export").onclick=function(e){var n=deckName+".webxoss",t=deckToJson(getCurrentDeck());download(n,t)},$("button-export-code").onclick=function(e){var n=deckToJson(getCurrentDeck());$("textarea-import-export").value=n,$("textarea-import-export").select()};var download=function(){var e=newElement("a");return e.target="_blank",e.style.position="fixed",e.style.width="0",e.style.height="0",e.style.overflow="hidden",e.style.top="0",e.style.left="0",e.style.zIndex="-1024",e.style.opacity="0",document.body.appendChild(e),function(n,t){e.href="data:application/octet-stream,"+encodeURI(t),e.download=n,e.click()}}();$("input-file").onchange=function(e){var n=$("input-file").files[0];if($("input-file").value=null,n){var t=n.name.replace(/\.webxoss$/,"");return inArr(t,deckNames)?void window.alert(Localize.editor("DECK_NAME_ALREADY_EXISTS",t)):void parseFile(n,function(e){return $("input-file").value=null,e?(createDeck(t,e),void hideImpotExport()):void window.alert(Localize.editor("FAILED_TO_PARSE_FILE"))})}},$("button-import-code").onclick=function(e){var n=$("textarea-import-export").value,t=parseCode(n);if(t){var r=window.prompt(Localize.editor("DECK_NAME"));if(!r)return;if(inArr(r,deckNames))return void window.alert(Localize.editor("DECK_NAME_ALREADY_EXISTS",r));createDeck(r,t),hideImpotExport()}else window.alert(Localize.editor("FAILED_TO_PARSE_CODE"))},$("link-back-to-webxoss").onclick=function(e){if(window.opener&&!window.opener.closed)return e.preventDefault(),window.close(),!1},search();