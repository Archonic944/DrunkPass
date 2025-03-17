function wipe(guiInstance) {
    guiInstance._controls = new Map(); // artisanal ad-hoc clearing
}

function giveSecretKey(p, init) {
    if(init){
        gui = guiSupply();
        giveSecretKey.secretKey = "...loading";
        fetch("/newuser", {
            method: "POST",
            headers: {
                'Content-Type': 'text/plain'
            },
        }).then((result) => {
            if(result.ok) {
                console.log("new user created");
                result.text().then((text) => {
                    giveSecretKey.secretKey = text;
                    console.log("secret key: " + text);
                });
            } else {
                console.error("error creating new user");
                alert("Something serious went wrong while registering you. Please reload.")
            }
        })
    } else {
        p.resetStyling();
        p.textSize(20);
        p.text("Your secret key: ", p.width * 0.5, p.height * 0.057);
        p.textSize(40);
        p.text(giveSecretKey.secretKey, p.width * 0.5, p.height * 0.2);
        p.text("[space] to continue", p.width * 0.5, p.height * 0.9);
        if(keyJustPressed && p.key === ' '){
            console.log("going to next func");
            nextUFunc = login;
            updateDialogue("secret_key_given");
        }
    }
}

function areYouNew(p, init) {
    if(init){
        console.log("init");
        gui = guiSupply();
        gui.button("y", p.width * 0.4, p.height * 0.8, 120, 80)
            .text("No")
            .textSize(15)
            .scheme("red")
            .setAction(() => {
                updateDialogue("new_user");
                nextUFunc = giveSecretKey;
            });
        gui.button("n", p.width * 0.6, p.height * 0.8, 120, 80)
            .text("Yes")
            .textSize(15)
            .scheme("green")
            .setAction(() => {
                updateDialogue("old_user");
                nextUFunc = login;
            });
    } else {
        p.resetStyling();
        gui.draw();
        p.textSize(40);
        p.fill(255);
        p.text("Have you been here before?", p.width * 0.5, p.height * 0.2);
    }
}

function login(p, init) {
    if(init){
        wipe(gui);
        gui.textfield("senter", p.width * 0.2, p.height * 0.7, 800, 50)
            .text("")
            .scheme("white")
            .textSize(20)
            .setAction((info) => {
                console.log("secret key: " + info.value);
                login.userVal = info.value;
            });
    } else {
        gui.draw();
        p.textSize(35);
        p.text("Enter your secret key.", p.width * 0.5, p.height * 0.2);
        if(keyJustPressed && p.keyCode === p.ENTER) {
            console.log("enter pressed");
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: login.userVal
            }).then((result) => {
                if(result.ok) {
                    console.log("login successful");
                    result.text().then((text) => {
                        window.secretKey = login.userVal;
                        passwordData = text;
                        updateDialogue("login_success");
                        nextUFunc = createOrRetrieve;
                    });
                } else {
                    updateDialogue("login_failure");
                }
            });
        }
    }
}

// sets up the next dialogue flow
window.createOrRetrieve = function(p, init) {
    updateDialogue("create_or_retrieve");
    nextUFunc = createOrRetrieveGUI;
};

function createOrRetrieveGUI(p, init) {
    if(init) {
        wipe(gui);
        gui = guiSupply();
        gui.button("createBtn", p.width * 0.3, p.height * 0.8, 120, 50)
            .text("Create")
            .textSize(15)
            .scheme("blue")
            .setAction(() => {
                updateDialogue("new_password");
                nextUFunc = createPassword;
            });
        gui.button("retrieveBtn", p.width * 0.6, p.height * 0.8, 120, 50)
            .text("Retrieve")
            .textSize(15)
            .scheme("yellow")
            .setAction(() => {
                updateDialogue("retrieve_password");
                nextUFunc = retrievePassword;
            });
    } else {
        gui.draw();
        p.resetStyling();
        p.textSize(30);
        p.text("Create or retrieve a password?", p.width * 0.5, p.height * 0.15);
    }
}

function createPassword(p, init) {
    if(init){
        createPassword.stage = 1;
        wipe(gui);
        gui = guiSupply();
        gui.textfield("accNameField", p.width * 0.3, p.height * 0.8, 400, 40)
            .text("")
            .scheme("white")
            .textSize(18)
            .setAction(info => {
                createPassword.accountName = info.value;
            });
    } else {
        gui.draw();
        p.textSize(25);
        if(createPassword.stage === 1){
            p.text("Enter account name, then press [ENTER].", p.width * 0.5, p.height * 0.2);
            if(keyJustPressed && p.keyCode === p.ENTER){
                createPassword.stage = 2;
                wipe(gui);
                gui = guiSupply();
                gui.textfield("accPwField", p.width * 0.3, p.height * 0.8, 400, 40)
                    .text("")
                    .scheme("white")
                    .textSize(18)
                    .setAction(info => {
                        createPassword.accountPw = info.value;
                    });
            }
        } else if(createPassword.stage === 2){
            p.text("Enter password, then press [ENTER].", p.width * 0.5, p.height * 0.2);
            if(keyJustPressed && p.keyCode === p.ENTER){
                let acc = (createPassword.accountName || "").replace(/\n/g, "");
                let pw  = (createPassword.accountPw || "").replace(/\n/g, "");
                savePassword(acc, pw);
                updateDialogue("password_created", commonPreProcessor(createPassword.accountPw, createPassword.accountName));
                nextUFunc = createOrRetrieve;
            }
        }
    }
}

function retrievePassword(p, init) {
    if(init){
        wipe(gui);
        gui = guiSupply();
        gui.textfield("retrieveField", p.width * 0.3, p.height * 0.4, 400, 40)
            .text("")
            .scheme("white")
            .textSize(18)
            .setAction(info => {
                retrievePassword.accountName = info.value;
            });
    } else {
        gui.draw();
        p.textSize(25);
        p.text("Enter account name, then press [ENTER].", p.width * 0.5, p.height * 0.2);
        if(keyJustPressed && p.keyCode === p.ENTER){
            let acc = (retrievePassword.accountName || "").replace(/\n/g, "");
            let pw = getPassword(acc);
            if(pw === null){
                updateDialogue("password_not_present");
                nextUFunc = createOrRetrieve;
            }else retrievalCutscene(p, acc, pw);
        }
    }
}

/**
 * Calls the current user function (nextUFunc) if set
 */
function callUFunc(p, init) {
    if(!nextUFunc) return;
    if(passwordRetrieval.retrieving){
        nextUFunc(p, init, passwordRetrieval.passwordToRetrieve, passwordRetrieval.passwordCandidate);
    } else {
        nextUFunc(p, init);
    }
    if(!nextUFunc.time) nextUFunc.time = 0;
    nextUFunc.time++;
}
