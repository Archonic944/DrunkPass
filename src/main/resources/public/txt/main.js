
new p5((p) => {
    p.resetStyling = function() {
        p.fill(255);
        p.stroke(255);
        p.strokeWeight(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.rectMode(p.CENTER);
        p.textSize(15);
        p.textLeading(20);
        p.textFont("monospace");
    };

    p.setup = function() {
        let canva = p.createCanvas(800, 800);
        guiSupply = () => GUI.get(canva, p);
    };

    p.draw = function() {
        //iff assets not ready, show loading
        if (!assetsAreReady || !chuckSprite) {
            p.background(100);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(20);
            if (!userInteracted) {
                p.text("Welcome to DrunkPass: password management for humans, by human.\nCreated by archonic, whoistoft, and  \n\nDesktop only!\nClick to begin.", p.width / 2, p.height / 2);
            } else {
                p.text("Loading assets... (" + loadedCount + "/" + totalAssets + ")", p.width / 2, p.height / 2);
            }
            if (p.mouseIsPressed && !userInteracted) {
                userInteracted = true;
                manualPreload(p);
            }
            return;
        }

        p.resetStyling();
        p.background(0);

        // Debug log keys
        if (p.keyIsTyped) {
            console.log(p.key);
        }

        drawSpace(p);

        if (!hideDialogueBox) {
            p.resetStyling();
            p.noFill();
            p.strokeWeight(2);
            p.rect(p.width / 2, p.height * 0.8, p.width * 0.8, p.height * 0.15);
            p.fill(255);
            p.noStroke();
            p.text(
                dialogueString.substring(0, dialogueProgress),
                p.width / 2,
                p.height * 0.8,
                p.width * 0.8,
                p.height * 0.15
            );
            if (dialogueInProgress) {
                if (keyJustPressed && p.key === ' ') {
                    dialogueProgress = dialogueString.length - 1;
                } else {
                    dialogueProgress++;
                }
                if (dialogueProgress >= dialogueString.length) {
                    dialogueInProgress = false;
                }
            } else {
                // If user hits space, move on
                if (keyJustPressed && p.key === ' ') {
                    if (!nextDialogue) {
                        console.log("going to u func");
                        if (nextUFunc) {
                            hideDialogueBox = true;
                            callUFunc(p, true);
                        }
                    } else {
                        updateDialogue(nextDialogue, currentDialoguePreProcessor);
                    }
                }
            }
        } else {
            callUFunc(p, false);
        }

        keyJustPressed = false;
    };

    p.keyTyped = function() {
        keyJustPressed = true;
    };
});
