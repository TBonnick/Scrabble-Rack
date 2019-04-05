/*function documentReady () {
    initialiseBoard(); 
}*/

function renderTile(container, letter) {
    let cont = container;
    let template = $.templates("#tile-template");
    template.link(cont, { letter: letter })
}

$(document).ready(function () {

    $("button.button-Test").click(function () {
        
        alert(getWordOnBoard());
    });
   
    $(".letter").on("click", function () {
        moveTile($(this), true)
    })

    $(".slot").on("click", function () {
        moveTile($(this), false)
    })

    $(".button-done").on("click", async function () {

        let word = getWordOnBoard();
        let isValid = await validateWord(word);
        showFeedback(isValid);

    })

    initialiseBoard();
})


function moveTile(tileContainer, toBoard) {
    let letterWithSpaces = tileContainer.text()
    let letter = letterWithSpaces.trim();

    let destinations;
    
    if (toBoard) {
        destinations = $(".slot");
    } else {
        destinations = $(".letter");
    }
    

    let dest = null;

    for (let i = 0; i < destinations.length; i++) {
        dest = $(destinations[i]);
        if (dest.text().trim() == "") {
            break;
        }
    }

    renderTile(dest, letter);


    tileContainer.empty();


}


async function getInitialRack() {
    let theWord = await getFiveLetterWord();
    console.log(theWord);
    let letters = theWord.split("");
   
    letters.push(randomLetter());
    letters.push(randomLetter());

    let result = [];
    while (letters.length) {
        let index = Math.floor(Math.random() * letters.length);
        let toMove = letters[index];
        result.push(toMove);
        letters.splice(index, 1);
    }
    return result;
}




async function initialiseRack() {
    let letters = await getInitialRack()
    $(".letter").each(function (i, e) { renderTile($(e), letters[i]); });
}

async function initialiseBoard() {
    $(".letter").empty()
    $(".slot").empty()
    
    await initialiseRack();


}

function showFeedback(wordIsValid) {
    if (wordIsValid) {
        $(".Feedback").text("right");
    } else {
        $(".Feedback").text("wrong");
    }
}

async function validateWord(word) {
    let url = "http://tom.mo2.dinksurveys.net/api/1.0/isword?word=" + word;
    let result = await $.ajax(url);
    return result.isWord;
}

function getWordOnBoard() {
    let result = "";

    $(".slot").each(function (i, e) {
        result += $(e).text().trim();
    });

    return result;
}

async function getFiveLetterWord() {
    let url = "http://tom.mo2.dinksurveys.net/api/1.0/getWord?letters=5";
    let result = await $.ajax(url);
    return result.word;
}

function randomLetter() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}



