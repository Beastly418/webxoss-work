'use strict';

function DeckManager () {
	this.getDeckNames();
}

DeckManager.prototype.getDeckNames = function () {
	var names = localStorage.getItem('deck_filenames');
	this._deckNames = names? JSON.parse(names) : [];
	return this._deckNames;
};

DeckManager.prototype._updateDeckNames = function () {
	this._deckNames.sort();
	localStorage.setItem('deck_filenames',JSON.stringify(this._deckNames));
};

DeckManager.prototype.createDeck = function (name,deck) {
	if (inArr(name,this._deckNames)) return false;
	this._deckNames.push(name);
	this._updateDeckNames();
	this.saveDeck(name,deck);
	return true;
};

DeckManager.prototype.renameDeck = function (name,newName) {
	if (!inArr(name,this._deckNames)) return false;
	if (inArr(newName,this._deckNames)) return false;
	var deck = this.loadDeck(name);
	this.deleteDeck(name);
	this.createDeck(newName,deck);
	return true;
};

DeckManager.prototype.deleteDeck = function (name) {
	if (!removeFromArr(name,this._deckNames)) return false;
	this._updateDeckNames();
	localStorage.removeItem('deck_file_'+name);
	return true;
};

DeckManager.prototype.loadDeck = function (name) {
	var deck = localStorage.getItem('deck_file_'+name);
	if (!deck) return null;
	return JSON.parse(deck);
};

DeckManager.prototype.saveDeck = function (name,deck) {
	if (!inArr(name,this._deckNames)) return false;
	localStorage.setItem('deck_file_'+name,JSON.stringify(deck));
	return true;
};

DeckManager.prototype.checkMainDeck = function (pids) {
	if (!isArr(pids)) return false;
	if (pids.length !== 40) return false;
	var infos = [];
	for (var i = 0; i < pids.length; i++) {
		var info = CardInfo[pids[i]];
		if (!info) {
			debugger;
			return false
		};
		info = CardInfo[info.cid];
		if (!info) {
			debugger;
			return false
		};
		infos.push(info);
	}
	if (infos.some(function (info) {
		if (info.cardType === 'LRIG') return true;
		if (info.cardType === 'ARTS') return true;
		if (info.cardType === 'RESONA') return true;
	})) return false;
	if (this.burstCount(pids) !== 20) return false;
	if (!this.checkDuplicate(pids)) return false;
	return infos;
};

DeckManager.prototype.checkLrigDeck = function (pids) {
	if (!isArr(pids)) return false;
	if (pids.length > 10) return false;
	var infos = [];
	for (var i = 0; i < pids.length; i++) {
		var info = CardInfo[pids[i]];
		if (!info) return false;
		info = CardInfo[info.cid];
		if (!info) return false;
		infos.push(info);
	}
	if (infos.some(function (info) {
		if (info.cardType === 'SIGNI') return true;
		if (info.cardType === 'SPELL') return true;
	})) return false;
	if (!infos.some(function (info) {
		return (info.cardType === 'LRIG') && (info.level === 0);
	})) return false;
	if (!this.checkDuplicate(pids)) return false;
	return infos;
};

DeckManager.prototype.checkMayusRoom = function (pids) {
	var infos = [];
	for (var i = 0; i < pids.length; i++) {
		var info = CardInfo[pids[i]];
		if (!info) return false;
		info = CardInfo[info.cid];
		if (!info) return false;
		infos.push(info);
	}
	// ?????? ??????+?????? ??? ??????+Three out
	if (infos.some(function (info) {
		return info.cid === 33; // ??????
	}) && infos.some(function (info) {
		return (info.cid === 34) || (info.cid === 84); // ??????, three out
	})) {
		return false;
	}
	// ?????? V?????????C+??????????????? ??? V?????????C+??????
	if (infos.some(function (info) {
		return info.cid === 1202; // V?????????C
	}) && infos.some(function (info) {
		return (info.cid === 884) || (info.cid === 1369); // ???????????????, ??????
	})) {
		return false;
	}
	// ?????? Lock+?????? ??? Lock+??????
	if (infos.some(function (info) {
		return info.cid === 534; // Lock
	}) && infos.some(function (info) {
		return (info.cid === 408) || (info.cid === 570); // ??????, ??????
	})) {
		return false;
	}
	// ?????? Ar+?????????
	if (infos.some(function (info) {
		return info.cid === 814; // Ar
	}) && infos.some(function (info) {
		return (info.cid === 1090); // ?????????
	})) {
		return false;
	}
	// ?????? ?????????
	if (infos.some(function (info) {
		return info.cid === 649; // ????????????????????????
	}) && infos.some(function (info) {
		return (info.cid === 1562); // ????????????????????????
	})) {
		return false;
	}
	// ?????? ?????????
	if (infos.some(function (info) {
		return info.cid === 957; // ????????????
	}) && infos.some(function (info) {
		return (info.cid === 1652); // ?????????????????????????????????????????????
	})) {
		return false;
	}
	// ??????
	var limitMap = {
		37: 2,  // <????????????????????????????????????>
		34: 2,  // <??????>
		178: 2, // <???????????????????????????????????????>
		1501: 2, // <??????????????????>
		534: 1, // <??????????????????>
		// 689: 1, // <???????????????>
		474: 0, // <??????????????????>
		23: 0,  // <????????????>
		689: 0, // <???????????????>
		1030: 0, // <????????????>
		1457: 0, // <?????????????????????>
		1212: 0, // <??????????????????????????????>
	};
	for (var i = 0; i < infos.length; i++) {
		var info = infos[i];
		var cid = info.cid;
		if (cid in limitMap) {
			limitMap[cid]--;
			if (limitMap[cid] < 0) return false;
		}
	}
	return true;
};

DeckManager.prototype.checkDeck = function (deck,mayusRoom) {
	var valid = this.checkMainDeck(deck.mainDeck) &&
	            this.checkLrigDeck(deck.lrigDeck);
	if (!valid) return false;
	if ((mayusRoom === false)) return true;
	return this.checkMayusRoom(deck.mainDeck.concat(deck.lrigDeck));
};

DeckManager.prototype.burstCount = function (pids) {
	var count = 0;
	pids.forEach(function (pid) {
		var info = CardInfo[pid];
		info = CardInfo[info.cid];
		if (info.burstEffectTexts && info.burstEffectTexts.length) {
			count++;
		}
	});
	return count;
};

DeckManager.prototype.checkDuplicate = function (pids) {
	var bucket = {};
	pids.forEach(function (pid) {
		var info = CardInfo[pid];
		if (info.sideA) {
			info = CardInfo[info.sideA]
		}
		if (info.cid in bucket) {
			bucket[info.cid]++;
		} else {
			bucket[info.cid] = 1;
		}
	});
	for (var cid in bucket) {
		if (bucket[cid] > 4) return false;
	}
	return true;
};