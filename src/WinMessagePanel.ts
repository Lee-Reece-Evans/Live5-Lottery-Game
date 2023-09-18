import {Graphics, Text, TextStyle, ColorSource} from 'pixi.js';
import {GenericContainer} from './GenericContainer';

export class WinMessagePanel extends GenericContainer
{
    private messageText: Text;

    /**
     * Construct a WinMessagePanel object
     * @param xPos X position to place the win message's container
     * @param yPos Y position to place the win message's container
     * @param width Width of the background graphic
     * @param height Height of the background graphic
     * @param text Text to display in the message
     */
    constructor(xPos: number, yPos: number, width: number, height: number, text: string)
    {
        super(xPos, yPos);

        // Panel background graphic
        const backgroundGraphic: Graphics = new Graphics();
        backgroundGraphic
            .beginFill(0xFFFFFF)
            .lineStyle(2, 0x000000)
            .drawRoundedRect(0, 0, width, height, 10)
            .endFill();
        backgroundGraphic.pivot.set(width / 2, height / 2);
        this.getContainer().addChild(backgroundGraphic);

        // Panel title text
        const textStyle = new TextStyle({
            fontFamily: 'Impact',
            fontSize: 24,
            fill: 'white',
        });
        this.messageText = new Text(text, textStyle);
        this.messageText.anchor.set(0.5, 0.5);
        this.getContainer().addChild(this.messageText);
    }

    /**
     * Sets the message to display
     * @param text Text to display
     */
    public setMessageText(text: string): void
    {
        this.messageText.text = text;
    }

    /**
     * Sets the text color
     * @param tint Tint of the text
     */
    public setMessageTint(tint: ColorSource): void
    {
        this.messageText.tint = tint;
    }
}
