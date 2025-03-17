// space.js

/**
 * Draw the “room” and Chuck sprite
 * @param {import("p5")} p
 */
function drawSpace(p) {
    const chuckWidth = 200;
    p.image(sprites.pictureFrame[0], p.width * 0.7, p.height * 0.3, chuckWidth * 0.6, chuckWidth * 0.6);
    p.image(sprites.couch[0], p.width * 0.2, p.height * 0.2, chuckWidth * 2.2, chuckWidth * 2.2);

    if (chuckSprite && chuckSprite.length > 1) {
        let pos = chuckSprite[1](p, chuckSprite);
        p.image(chuckSprite[0], pos[0] + chuckOffsetX, pos[1], chuckWidth, chuckWidth);
    } else if (chuckSprite) {
        p.image(chuckSprite[0], p.width / 2 - chuckWidth/2, p.height / 2 - chuckWidth/2, chuckWidth, chuckWidth);
    }
    p.image(sprites.lightbulb[0], p.width * 0.3, 0, chuckWidth * 2, chuckWidth * 2);
}
