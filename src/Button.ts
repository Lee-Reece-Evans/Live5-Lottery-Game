import {Graphics, Text, TextStyle} from 'pixi.js'
import {GenericContainer} from './GenericContainer'

export class Button extends GenericContainer
{
    private buttonBackgroundGraphic: Graphics;

    /**
     * Construct a Button object
     * @param xPos X position to place the button's container
     * @param yPos Y position to place the button's container
     * @param width Width of the background graphic
     * @param height Height of the background graphic
     * @param text Text to display on the button
     * @param callback A function called once the button is clicked
     */
    constructor(xPos: number, yPos: number, width: number, height: number, text: string,
        callback: () => void)
    {
        super(xPos, yPos);

        // Create button background graphic
        this.buttonBackgroundGraphic = new Graphics();
        const buttonBackgroundGraphicWidth: number = width;
        const buttonBackgroundGraphicHeight: number = height;
        this.buttonBackgroundGraphic
            .beginFill(0xFFFFFF)
            .lineStyle(2, 0x000000)
            .drawRoundedRect(0, 0, buttonBackgroundGraphicWidth, buttonBackgroundGraphicHeight, 15)
            .endFill();
        this.buttonBackgroundGraphic.pivot.set(buttonBackgroundGraphicWidth / 2, buttonBackgroundGraphicHeight / 2);

        // Create button text
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'black',
        });
        const buttonText = new Text(text, textStyle);
        buttonText.anchor.set(0.5, 0.5);

        this.getContainer().addChild(this.buttonBackgroundGraphic, buttonText);

        // Listen for a mouse pointer down event on the background graphic
        this.buttonBackgroundGraphic.on("pointerdown", callback.bind(this));
        this.setEnableInteractable();
    }

    /**
     * Enables the interactability of this button
     */
    public setEnableInteractable(): void
    {
        this.buttonBackgroundGraphic.eventMode = "static";
        this.buttonBackgroundGraphic.cursor = 'pointer';
    }

    /**
     * Disables the interactability of this button
     */
    public setDisableInteractable(): void
    {
        this.buttonBackgroundGraphic.eventMode = "none";
        this.buttonBackgroundGraphic.cursor = 'default';
    }
}
