//sound/image containers declared in globals.js as well, they're filled here
window.sounds = {};
window.sprites = {};

const assetsToLoad = [
    { type: "sound", path: "audio/mainloopp.mp3", key: "mainloopp.mp3" },
    { type: "sound", path: "audio/midwxst.mp3", key: "midwxst.mp3" },
    { type: "sound", path: "audio/silent_1s.mp3", key: "silent_1s.mp3" },
    { type: "sound", path: "audio/orchhit.mp3", key: "orchhit.mp3" },
    { type: "sound", path: "audio/win_loop.mp3", key: "win_loop.mp3" },
    { type: "sound", path: "audio/baby_cry.mp3", key: "baby_cry.mp3" },
    {type: "sound", path: "audio/stfu.mp3", key: "stfu.mp3"},
    { type: "image", path: "sprites/idle_with_beer.png", key: "chuckIdle",
        pos: (p) => [p.width / 2 - 200 / 2, p.height / 2 - 200 / 2] },
    { type: "image", path: "sprites/gross_couch.png", key: "couch" },
    { type: "image", path: "sprites/idle_with_beer_sideways.png", key: "chuckSideways" },
    { type: "image", path: "sprites/hold_beer.png", key: "chuckHoldBeer", pos: (p, inst) => {
        //make him snap up and down
        let period = 25;
        let phase = (p.frameCount % period) / period;
        let initPose = sprites.chuckIdle[1](p);
        let x = initPose[0];
        let y = initPose[1] + (phase < 0.5 ? 0 : 15);
        return [x,y];
        }},
    { type: "image", path: "sprites/chuck_and_child.png", key: "pictureFrame" },
    { type: "image", path: "sprites/lightbulb.png", key: "lightbulb" },
    {type: "image", path: "sprites/chuck_angry.png", key: "chuckAngry"},
    {type: "image", path: "sprites/chuck_crying.png", key: "chuckCrying"},
    {type: "image", path: "sprites/chuck_breaking_down.png", key: "chuckBreakingDown"},
    {type: "image", path: "sprites/chuck_breaking_down_2.png", key: "chuckBreakingDown2"},
    {type: "image", path: "sprites/chuck_happy.png", key: "chuckHappy", pos: (p, inst) => {
            let period = 75;
            let phase = (p.frameCount % period) / period;

            let add = phase < 0.5
                ? phase * 2 * 50
                : (1 - phase) * 2 * 50;

            let x = p.width * 0.1 + add * 4;
            let y = p.height / 2 - 200 / 2;

            if (phase > 0.5 && !inst.flipped || phase <= 0.5 && inst.flipped) { //swaperooni
                let temp = sprites.chuckHappy[0];
                inst[0] = sprites.chuckHappyFlipped[0];
                inst.flipped = !inst.flipped;
                sprites.chuckHappyFlipped[0] = temp;
            }

            return [x, y];
        }},
    {type: "image", path: "sprites/chuck_happy_flipped.png", key: "chuckHappyFlipped"}, //just a resouce for chuck_happy to grab
    {type: "image", path: "sprites/baby_noise.png", key: "babyNoise"}
];

let totalAssets = assetsToLoad.length;
let loadedCount = 0;
window.assetsAreReady = false;

function assetLoaded() {
    loadedCount++;
    if (loadedCount >= totalAssets) {
        fetchDialogue("opening_1", areYouNew);
        assetsAreReady = true;
        globalDebug = sounds;
    }
}

/**
 * Manual preload for all assets using p5's load functions
 * @param {import("p5")} p
 */
function manualPreload(p) {
    assetsToLoad.forEach(asset => {
        if (asset.type === "image") {
            p.loadImage(
                asset.path,
                img => {
                    if (asset.pos) {
                        sprites[asset.key] = [img, asset.pos];
                    } else {
                        sprites[asset.key] = [img];
                    }
                    console.log("Loaded image:", asset.path);
                    assetLoaded();
                },
                () => {
                    console.warn("Failed to load image:", asset.path);
                    assetLoaded();
                }
            );
        } else if (asset.type === "sound") {
            sounds[asset.key] = soundloaderLoad(asset.path);
            assetLoaded();
        }
    });
}
