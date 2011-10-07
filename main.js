function FriendFinder(options) {
    if(options) {
        jQuery.extend(this, options);    
    }

    this.form = $(this.form);
    this.form.submit($.proxy(this.findFriends, this));
    this.searching = false;
    this.word = '';
    this.stop = $(this.stop);
    this.stop.click($.proxy(this.stopSearch, this));    
    this.working = $(this.working);
    
    $.ajax('words.txt', {'success':$.proxy(this.buildWordList, this)});
};

FriendFinder.prototype.createWorker = function() {
    this.worker = new Worker('worker.js'); 
    this.worker.addEventListener('message', $.proxy(this.receiveMessage, this), false);
    this.worker.postMessage({'wordList':this.wordList});
}

FriendFinder.prototype.stopSearch = function(event) {
    this.working.hide();
    this.stop.hide(); 
    this.worker.terminate();
    delete this.worker;
    return false;
}

FriendFinder.prototype.buildWordList = function(data) {
    this.words = data.split(/\r\n|\r|\n/);
    this.wordList = {};

    for(var i=0; i<this.words.length; i++) {
        this.wordList[this.words[i]] = true;
    }
    
    this.createWorker();
};

FriendFinder.prototype.findFriends = function(event) {
    if(this.searching) {
        this.stopSearch();    
    }

    this.working.show();
    this.stop.show();
    this.word = this.form.find(this.wordInput).val(); 
    this.worker.postMessage({'word':this.word});
    return false;
};


FriendFinder.prototype.receiveMessage = function(event) {
    if(event.data.type == 'log') {
        console.log(event.data.data);
    } else if(event.data.type == 'answer') {
        this.working.hide();
        this.stop.hide();
        var seconds = event.data.elapsed/1000;
        $("#answer").html('Found '+addCommas(event.data.friendCount)+' friends in '+seconds+' seconds');
    }
};

//Taken from http://www.mredkj.com/javascript/numberFormat.html
function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

$(function() {
    var finder = new FriendFinder({"form":"form", "working":"#working", "stop":"#stop", "wordInput":"input[name='word']"});
});
