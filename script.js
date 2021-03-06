$(document).ready(function(){
    var gamestate = 0;
    var sequences = [];
    var playerSeq = [];
    var flashes = 0;
    var flashInt;
    var strict = 0;
    var seqInt;
    var seqNum = 0;
    var multiplier = 0;
    var multiplier2 = 0;
    var map = ["green", "red", "yellow", "blue"];
    var sounds = {
        0: "sounds/simonSound1.mp3",
        1: "sounds/simonSound2.mp3",
        2: "sounds/simonSound3.mp3",
        3: "sounds/simonSound4.mp3"
    }
    function playAudio(num) {
        var sound = new Howl({
            src: [sounds[num]]
        });
        sound.play();
    }
    $("#onoff").on("click", function(){
        if (gamestate == 0){
            gamestate = 1;
            initialize();
        } else {
            gameOff();
        }
    });
    $("#strictmode").on("click", function(){
        if (strict == 1){
            $("#strictmode").removeClass("strictOn");
            strict = 0;
        } else {
            $("#strictmode").addClass("strictOn");
            strict = 1;
        }
    });
    $(".simonbutton").mousedown(function(){
        if ($(this).hasClass("unclickable")){return;}
        playAudio($(this).data("value"));
        $(this).addClass(map[$(this).data("value")] + "On");
    });
    $(".simonbutton").mouseup(function(){
        if ($(this).hasClass("unclickable")) { return; }
        $(this).removeClass(map[$(this).data("value")] + "On");
        if ($(this).data("value") == sequences[playerSeq.length]) {
            playerSeq.push($(this).data("value"));
            if (valuesMatch(sequences, playerSeq)) {
                if (sequences.length == 20){
                    gameWon();
                } else {
                $(this).removeClass(map[$(this).data("value")] + "On");
                newRound();
                }
            }
        } else {
            $(this).addClass("unclickable");
            wrongChoice();
        }
    });
    function gameWon(){
        $("#screen > h2").text("WIN");
        $(".simonbutton").addClass("unclickable");
        flashInt = setInterval(function(){
            $("#green").addClass("greenOn");
            // var sound = new Audio(sounds[$(this).data("value")]);
            // sound.play();
            console.log($(this).data("value"));
            $("#blue").addClass("blueOn");
            setTimeout(() => {
                $("#green").removeClass("greenOn");
                $("#blue").removeClass("blueOn");
            }, 250);
            $("#red").addClass("redOn");
            $("#yellow").addClass("yellowOn");
            setTimeout(() => {
                $("#red").removeClass("redOn");
                $("#yellow").removeClass("yellowOn");
            }, 250);
            flashes++;
            if (flashes == 5) {
                clearInterval(flashInt);
                flashes = 0;
                setTimeout(() => {
                    if (confirm("Do you want to play again?") == true) {
                        initialize();
                    } else {
                        gameOff();
                    }
                }, 1000);
            }
        }, 500);
    }
    function valuesMatch(arr1, arr2){
        if (arr1.length != arr2.length){return false;}
        for (var i = 0; i < arr1.length;i++){
            if (arr1[i] != arr2[i]){
                return false;
            }
        }
        return true;
    }
    function gameOff(){
        gamestate = 0;
        clearInterval(flashInt);
        clearInterval(flashSeq);
        $("#screen > h2").removeClass("textOn");
        $("#screen > h2").text("--");
        $(".simonbutton").addClass("unclickable");
    }
    function flashScreen(text){
        $(".simonbutton").addClass("unclickable");
        if (text != undefined) {
            $("#screen > h2").text(text);
        } else {
            $("#screen > h2").text("--");
        }
        flashInt = setInterval(function () {
            $("#screen > h2").addClass("textOn");
            setTimeout(() => {
                $("#screen > h2").removeClass("textOn");
            }, 250);
            flashes++;
            if (flashes == 3) {
                clearInterval(flashInt);
                flashes = 0;
                $("#screen > h2").addClass("textOn");
                setTimeout(() => {
                    $("#screen > h2").addClass("textOn");
                }, 499);
            }
        }, 500);
    }
    function flashSeq(){
        $(".simonbutton").addClass("unclickable");
        if (sequences.length >= 13) {
            multiplier = 400;
            multiplier2 = 650;
        } else if (sequences.length >= 9) {
            multiplier = 266;
            multiplier2 = 433;
        } else if (sequences.length >= 5) {
            multiplier = 133.333;
            multiplier2 = 216;
        }
        setTimeout(() => {
            $("#screen > h2").text(toDoubleDigit(sequences.length));
        }, 500);
        seqInt = setInterval(function(){
            $("#" + map[sequences[seqNum]]).addClass(map[sequences[seqNum]] + "On");
            playAudio(String(sequences[seqNum]));
            setTimeout(() => {
                $("#" + map[sequences[seqNum]]).removeClass(map[sequences[seqNum]] + "On");
                if (gamestate == 0) {
                    seqNum = sequences.length - 1;
                    clearInterval(seqInt);
                    seqNum = 0;
                } else if (seqNum == sequences.length - 1) {
                    clearInterval(seqInt);
                    setTimeout(() => {
                        $(".simonbutton").removeClass("unclickable");
                    }, 250);
                    seqNum = 0;
                } else {
                    seqNum++;
                }
            }, 750 - multiplier);
        }, 1250 - multiplier2);
    }
    function initialize(text){
        sequences = [];
        multiplier = 0;
        flashScreen();
        setTimeout(() => {
            newRound();
        }, 2750);
    }
    function newRound() {            
        sequences.push(Math.floor(Math.random() * 4));
        playerSeq = [];
        flashSeq();
    }
    function wrongChoice(){
        if (strict == 1){
            initialize();
        } else {
            playerSeq = [];
            flashScreen();
            setTimeout(() => {
                flashSeq();
            }, 2000);
        }
    }
    function toDoubleDigit(num){
        if (num < 10){
            return "0" + num;
        }
        return num;
    }
});
