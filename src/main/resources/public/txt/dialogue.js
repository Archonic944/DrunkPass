/**
 * Fetches the YML dialogue, sets `dialogueData`, then updates with the initial dialogue path.
 * @param {string} initial_dialogue
 * @param {Function} nextFunc
 */
function fetchDialogue(initial_dialogue, nextFunc) {
    fetch('/txt/chuck_dialogue.yml')
        .then(response => response.text())
        .then(data => {
            dialogueData = jsyaml.load(data);
            console.log("loaded dialogue data");
            updateDialogue(initial_dialogue);
            nextUFunc = nextFunc;
        })
        .catch(error => console.error('Error fetching dialogue:', error));
}

/**
 * Updates the current dialogue text, triggers any associated sprite or sound.
 * @param {string} dialoguePath
 * @param {Function} [preProcessor]
 */
window.updateDialogue = function(dialoguePath, preProcessor) {
    currentDialoguePreProcessor = preProcessor;
    let dialogue;
    for (let key in dialogueData) {
        let dialogueItem = dialogueData[key];
        if (dialogueItem[dialoguePath] !== undefined) {
            console.log("found dialogue item: " + key);
            dialogue = dialogueItem[dialoguePath][0];
            break;
        }
    }
    if (dialogue) {
        dialogueString = dialogue.text;
        if (preProcessor) {
            dialogueString = preProcessor(dialogueString);
        }
        nextDialogue = dialogue.to !== 'none' ? dialogue.to : null;
        let dialogueSound = dialogue.sound;
        dialogueProgress = 0;
        maxDialogueProgress = dialogueString.length;
        dialogueInProgress = true;
        hideDialogueBox = false;

        // sprite
        if (dialogue.sprite) {
            if (sprites[dialogue.sprite]) {
                chuckSprite = sprites[dialogue.sprite];
            } else {
                console.warn("HEY! Sprite not found: " + dialogue.sprite);
                chuckSprite = sprites.chuckIdle;
            }
        }

        // sound
        if (dialogueSound && dialogueSound !== 'none') {
            let soundFile = sounds[dialogueSound];
            if (soundFile) {
                if (!currentlyPlayingSound || !(currentlyPlayingSound === soundFile)){ // ONLY run this if the sound is not already playing
                    if(currentlyPlayingSound) currentlyPlayingSound.stop();
                    soundFile.play();
                    if (soundFile.duration() > 10) {
                        soundFile.loop();
                    }
                    currentlyPlayingSound = soundFile;
                }
            } else {
                console.warn("HEY! Sound file not found: " + dialogueSound);
            }
        }
    }
};
