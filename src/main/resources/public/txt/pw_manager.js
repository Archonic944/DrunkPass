function getPassword(acc) {
    //just get the password from passwordData
    let lines = passwordData.split("\n");
    let index = lines.indexOf(acc);
    if(index === -1){
        return null;
    }
    let pw = lines[index + 1];
    if(pw === undefined){
        return null;
    } else {
        passwordRetrieval.passwordToRetrieve = pw;
        passwordRetrieval.passwordCandidate = acc;
        return pw;
    }
}

function savePassword(acc, pw){
    passwordData += "\n" + acc + "\n" + pw;
    fetch("/save",{
        method: "POST",
        body: secretKey + ";" + passwordData,
        headers: {'Content-Type': 'text/plain'}
    });
}

function commonPreProcessor(passwordToRetrieve, passwordCandidate) {
    let generateNonsense = () => {
        const choices = [
            "😜🤓PASSWORDPASSWORDP🥵AFEWWWORD!😂🤣🤩",
            "STUPIFD!PASSWORD!1!1😅🥹🥳😎",
            "🥶😰ITSAPASSWORD123123123123!!!!!!!!!!!!!!!!!!!😩",
            "ilovebeer8686!!",
            "chuckiscool1234",
            "drunkpassrocks!!!😤1!",
            "password",
            "CAT🤬🐱🐤UP😂😅AAA😔MACHINE!😟😔"
        ];
        return choices[Math.floor(Math.random() * choices.length)];
    };

    return (str) => {
        return str
            .replace(/\$candidate/g, passwordCandidate)
            .replace(/\$password/g, passwordToRetrieve)
            .replace(/\$nonsense/g, () => generateNonsense()) // Will generate new nonsense for each match
            .replace(/\$snippet/g, () => {
                let start = Math.floor(Math.random() * (passwordToRetrieve.length - 3));
                return passwordToRetrieve.substring(start, start + 3);
            });
    }
}

/** @param {import("p5")} p
 * @param init
 * @param passwordToRetrieve
 * @param passwordCandidate
 */
function forgets(p, init, passwordToRetrieve, passwordCandidate){
    if(init){
        let str = "forget_";
        //append 1-5 for a random one
        let id = Math.floor(Math.random() * 5 + 1);
        str += id;
        updateDialogue(str, commonPreProcessor(passwordToRetrieve, passwordCandidate));
        nextUFunc = createOrRetrieve;
    }
}

function midlifeCrisis(p, init, passwordToRetrieve, passwordCandidate){
    if(init){
        updateDialogue("midlife_crisis_1", commonPreProcessor(passwordToRetrieve, passwordCandidate));
        nextUFunc = createOrRetrieve;
    }
}

function remembers(p, init, passwordToRetrieve, passwordCandidate){
    if(init){
        updateDialogue("chuck_remembers_1", commonPreProcessor(passwordToRetrieve, passwordCandidate));
        nextUFunc = createOrRetrieve;
    }
}

function baby(p, init, passwordToRetrieve, passwordCandidate){
    if(init){
        updateDialogue("baby_1", commonPreProcessor(passwordToRetrieve, passwordCandidate));
        nextUFunc = (p, init) => {
            if(init){
                if(currentlyPlayingSound) {

                } currentlyPlayingSound.stop();
                sounds["baby_cry.mp3"].play();
            }
            if(nextUFunc.time < 120){ //time is handled elsewhere
                if(Math.round(nextUFunc.time / 20 % 2) === 0){
                    p.image(sprites.babyNoise[0], p.width * 0.8, p.height * 0.5, 100, 100);
                }
            }else{
                //finished
                updateDialogue("baby_2", commonPreProcessor(passwordToRetrieve, passwordCandidate));
                nextUFunc = (p, init) => {
                    if(nextUFunc.time < 80){
                        chuckOffsetX += 6;
                    }else{
                        if(currentlyPlayingSound) {
                            currentlyPlayingSound.stop();
                            currentlyPlayingSound = null;
                        }
                        sounds["stfu.mp3"].play();
                        nextUFunc = (p, init) => {
                            if(nextUFunc.time >= 130){
                                nextUFunc = () => {
                                    if(chuckOffsetX > 0){
                                        chuckOffsetX -= 5;
                                    }else{
                                        chuckOffsetX = 0;
                                        updateDialogue("baby_3");
                                        nextUFunc = createOrRetrieve;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function retrievalCutscene(p, acc, pw) {

    // 20% chance that he remembers
    // 10% chance that he has a midlife crisis
    // 10% chance that the baby acts up
    // 60% chance that he forgets

    let rand = Math.floor(Math.random() * 10 + 1);
    if (rand <= 2) {
        remembers(p, true, pw, acc);
    } else if (rand <= 3) {
        midlifeCrisis(p, true, pw, acc);
    } else if (rand <= 4) {
        baby(p, true, pw, acc);
    } else {
        forgets(p, true, pw, acc);
    }
}