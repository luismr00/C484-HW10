const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
// const originText = document.querySelector("#origin-text p").innerHTML;
const originText = document.querySelector("#origin-text p"); //to change innerHTML
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const theScores = document.querySelector("#top3");

// Timer variables
var interval;
var timeCount;
var minutes = 0;
var seconds = 0;
var miliseconds = 0;
var counter = 0;

// Display timer variables to help with leading 0s
var mstime;
var sectime;
var mintime;

// Top 3 score variables
var scores = [];
var totalCount;
var score1;
var score2;
var score3;

// Test quotes variables
var quoteCounter = 0;
var quoteIndex = 0;
var currentQuote;

var quotes_array = [
    "Push yourself, because no one else is going to do it for you.",
    "Failure is the condiment that gives success its flavor.",
    "Wake up with determination. Go to bed with satisfaction.",
    "It's going to be hard, but hard does not mean impossible.",
    "Learning never exhausts the mind.",
    "The only way to do great work is to love what you do."
];

// Quotes for quick testing purposes
// var quotes_array = ['goo', 'goo', 'gah', 'gah'];


//add first quote from the DOM for originText
originText.innerHTML = quotes_array[0];


// Add leading zero to numbers 9 or below (purely for aesthetics):

function timerDisplay() {

    if (miliseconds < 10) 
        mstime = "0" + miliseconds;
    else
        mstime = miliseconds;

    if (seconds < 10)
        sectime = "0" + seconds;
    else
        sectime = seconds;

    if (minutes < 10)
        mintime = "0" + minutes;
    else
        mintime = minutes;

    timeCount = mintime + ':' + sectime + ':' + mstime;
    theTimer.innerHTML = timeCount;
}


// Run a standard minute/second/hundredths timer:

function timer() {

    counter++;

    if (counter > 9)
        miliseconds = counter;
    if (counter > 99) {
        seconds++;
        counter = 0;
        miliseconds = counter;
    }
    if (seconds > 59) {
        seconds = 0;
        minutes++;
    }

    timerDisplay();

}


// Match the text entered with the provided text on the page:

function matchContent(e) {

    var textAreaContent;
    var originTextArr;
    var matchArr;
    var matchText;

    //if the test words array does NOT equal length of array, then it won't run when the user finishes the test
    if (quoteCounter < quotes_array.length) {

        //get quote from array
        currentQuote = quotes_array[quoteCounter];

        textAreaContent = e.target.value;
        // originTextArr = originText.split('');
        originTextArr = currentQuote.split('');
        matchArr = originTextArr.slice(0, textAreaContent.length);
        matchText = matchArr.join('');

        //start timer if it's all 0s
        if (theTimer.innerHTML === '00:00:00') {
            startTimer();
            // console.log("This should start ONCE")
        }

        if (textAreaContent === matchText) {
            //indicates user doing well
            testWrapper.style.borderColor = "#2AD9FA";
        } else {
            //indicates user typing wrong
            testWrapper.style.borderColor = "#D62301";
        }

        if (textAreaContent === currentQuote) {

            // console.log("Swapping quote...");
            quoteCounter++;

            //switch quote from the DOM for originText
            currentQuote = quotes_array[quoteCounter];
            originText.innerHTML = currentQuote;

            //clear textarea for new typing
            testArea.value = '';
        }

        if (quoteCounter === quotes_array.length) {
            // console.log("This should stop NOW...")

            //Change border color from textarea to indicate success, stop timer, and get scores
            testWrapper.style.borderColor = "#96F82A";
            clearInterval(interval);
            getScores(theTimer.innerHTML);

            //display a quote to the user to indicate finish
            originText.innerHTML = "Good job, try again sometime!";
        }
    }
    else {
        console.log('User must press the start over button to try again.')
    }

}


// Start the timer:

function startTimer() {

    //timer runs every 10 miliseconds so it can help display the miliseconds only with two digits as opposed to four
    interval = setInterval(timer, 10);

}

// Reset everything:

function resetTimer() { 
    
    //reset all values needed for the timer to start over
    theTimer.innerHTML = '00:00:00';
    testArea.value = '';
    quoteCounter = 0;

    minutes = 0;
    seconds = 0;
    miliseconds = 0;
    counter = 0;

    //stop timer in case user wants to stop early and change the border color from textarea
    clearInterval(interval);
    testWrapper.style.borderColor = "grey";

    //add first quote to start over
    originText.innerHTML = quotes_array[0];

}

// Get and append scores

function getScores(t) {
    
    var s;
    var scoreArr;
    var arrayItem;
    var tempArr;
    var scoreElement = document.createElement("p");
    var score;
    var elementText;

    // Get score or s WITHOUT the colons
    scoreArr = t.split('');
    scoreArr.splice(2, 1);
    scoreArr.splice(4, 1);
    s = scoreArr.join('');

    //convert s to an integer
    s = parseInt(s);
    

    if (scores.length < 3) {
        console.log("Pushing new timer...")
        scores.push(s);
    } else {
        //Pushing new timer ONLY IF the new score is lower than any of the saved scores
        for (var i = 0; i < scores.length; i++) {
            if (s < scores[i]) {
                scores.push(s);
                break;
            }
        }
    }

    //sort all scores
    scores.sort(function(a,b) {
        return a - b;
    });

    //pop last item from array if the length of scores is less than 3
    if (scores.length === 4)
        scores.pop();

    //clear all scores for new ones from the DOM
    while (theScores.firstChild) {
        theScores.removeChild(theScores.firstChild);
    }

    //print all values as a string with colons
    for (var j = 0; j < scores.length; j++) {
        
        //convert items within array back to a string
        arrayItem = scores[j];
        arrayItem = arrayItem.toString();
        tempArr = arrayItem.split('');

        //if tempArr length is not 6, add leading 0s
        while (tempArr.length != 6) {
            tempArr.unshift("0");
        }

        //adding back colons to the string score
        tempArr.splice(4, 0, ':')
        tempArr.splice(2, 0, ':');
        score = tempArr.join('');

        //add scores to the DOM
        elementText = document.createTextNode(score);
        scoreElement.append(elementText);
        theScores.append(scoreElement);

        //reset scoreElement for new append
        scoreElement = document.createElement("p");
    }

    // console.log(score);

}


// Event listeners for keyboard input and the reset button:

testArea.addEventListener('input', matchContent);

resetButton.addEventListener('click', resetTimer); 