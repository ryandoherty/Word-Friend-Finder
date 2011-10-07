function FriendFinder(options) {
    if(options) {
        jQuery.extend(this, options);    
    }

    //Get word list

    this.form = $(this.form);
    this.friendsList = $(this.friendsList);
    this.form.submit($.proxy(this.findFriends, this));
    this.searching = false;
    this.word = '';
    this.worker = new Worker('worker.js');
    this.worker.addEventListener('message', $.proxy(this.receiveMessage, this), false);
    this.stop = $(this.stop);
    this.stop.click($.proxy(this.stopSearch, this));    
    
    $.ajax('words.txt', {'success':$.proxy(this.buildWordList, this)});
};

FriendFinder.prototype.stopSearch = function(event) {
    this.worker.terminate();
    delete this.worker;
    this.worker = new Worker('worker.js'); 
    this.worker.addEventListener('message', $.proxy(this.receiveMessage, this), false);
    this.worker.postMessage({'wordList':this.words});
    return false;
}

FriendFinder.prototype.buildWordList = function(data) {
    this.words = data.split(/\r\n|\r|\n/);
    this.worker.postMessage({'wordList':this.words});
};

FriendFinder.prototype.findFriends = function(event) {
    this.word = this.form.find(this.wordInput).val(); 
    this.worker.postMessage({'word':this.word});
    return false;
};


FriendFinder.prototype.receiveMessage = function(event) {
    if(event.data.type == 'log') {
        console.log(event.data.data);
    }
};

$(function() {
    var finder = new FriendFinder({"form":"form", "stop":"#stop", "wordInput":"input[name='word']", "friendsList":"#friends"});
});
