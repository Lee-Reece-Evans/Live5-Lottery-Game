import {Graphics, Text, TextStyle} from 'pixi.js'
import {GenericContainer} from './GenericContainer';

export class PaytableItem extends GenericContainer
{
    private matchText: Text;
    private prizeText: Text;

    /**
     * Construct a PaytableItem object
     * @param xPos X position to place the paytable item's container
     * @param yPos Y position to place the paytable item's container
     * @param width Width of the paytable item's background Graphic
     * @param height Height of the paytable item's background Graphic
     * @param matchingCount The number of matching balls to display
     * @param prize The prize to display
     */
    constructor(xPos: number, yPos: number, width: number, height: number, matchingCount: string, prize: string)
    {
        super(xPos, yPos);

        // Create ball background graphic
        const backgroundGraphic: Graphics = new Graphics();
        backgroundGraphic
            .beginFill(0xFFFFFF)
            .lineStyle(2, 0x000000)
            .drawRoundedRect(0, 0, width, height, 10)
            .endFill();
        backgroundGraphic.pivot.set(width / 2, height / 2);
        this.getContainer().addChild(backgroundGraphic);

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'black',
        });

        // Create number of balls to match text
        const xPositionPadding: number = 10;
        this.matchText = new Text('MATCH ' + matchingCount, textStyle);
        this.matchText.position.x = (-this.getContainer().width / 2) + xPositionPadding;
        this.matchText.anchor.set(0, 0.5);

        // Create prize text associated with the number of matching balls
        this.prizeText = new Text(prize, textStyle);
        this.prizeText.position.x = (this.getContainer().width / 2) - xPositionPadding;
        this.prizeText.anchor.set(1, 0.5);

        this.getContainer().addChild(this.matchText, this.prizeText);
    }
}
