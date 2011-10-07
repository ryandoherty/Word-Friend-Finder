var words = false;
var friends = {};
var numbWords = 0;
var depth = 0;
var friendCount = 0;

console = {
    'log' : function(data) {
            postMessage({'type':'log', 'data':data});
    }
};

self.addEventListener('message', function(event) {

    if(event.data.word) {
        //do a search!
        var start = Date.now();

        friends = {};
        depth = 0;
        friendCount = 0;
        findFriends(event.data.word);

        var end = Date.now();
        var elapsed = end - start;
        console.log(friendCount);
        console.log('time: '+elapsed);
    }

    if(event.data.wordList) {
        words = event.data.wordList;
        numbWords = words.length;
    }
}, false);

function findFriends(word) {
    depth++;
    for(var i=0; i<numbWords; i++) {
        var testWord = words[i];
        if(lDistance(word, testWord) == 1) {

            if(!friends[testWord]) {
                friends[testWord] = true;
                friendCount++;
                findFriends(testWord);
            }
        }
    }
}

//Code stolen from http://andrew.hedges.name/experiments/levenshtein/levenshtein.js
lDistance = function(word1, word2) {
    var cost;

    // get values
    var a = word1;
    var m = a.length;

    var b = word2;
    var n = b.length;

    // make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
    if (m < n) {
        var c=a;a=b;b=c;
        var o=m;m=n;n=o;
    }

    var r = new Array();
    r[0] = new Array();
    for (var c = 0; c < n+1; c++) {
        r[0][c] = c;
    }

    for (var i = 1; i < m+1; i++) {
        r[i] = new Array();
        r[i][0] = i;
        for (var j = 1; j < n+1; j++) {
            cost = (a.charAt(i-1) == b.charAt(j-1))? 0: 1;
            r[i][j] = minimator(r[i-1][j]+1,r[i][j-1]+1,r[i-1][j-1]+cost);
        }
    }

    return r[m][n];
}

// return the smallest of the three values passed in
minimator = function(x,y,z) {
    if (x < y && x < z) return x;
    if (y < x && y < z) return y;
    return z;
}
