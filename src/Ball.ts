import {Graphics, Text, TextStyle, ColorSource} from 'pixi.js'
import {GenericContainer} from './GenericContainer'

export const enum BallColors
{
    White = 0xFFFFFF,
    Blue = 0x00FFFF,
    Pink = 0xFFC0CB,
    Green = 0x008000,
    Yellow = 0xFFFF00,
    Purple = 0x800080
}

type BallColorMap = {[numberThreshold: string]: ColorSource};

export class Ball extends GenericContainer
{
    private static ballColorMap: BallColorMap = {
        '10': BallColors.White,
        '20': BallColors.Blue,
        '30': BallColors.Pink,
        '40': BallColors.Green,
        '50': BallColors.Yellow,
        '60': BallColors.Purple
    };

    protected ballBackgroundGraphic: Graphics;
    private ballNumberText: Text;

    private ballIndex: number = 0;
    private ballNumber: number = 0;

    /**
     * Construct a Ball object
     * @param xPos X position to place the ball's container
     * @param yPos Y position to place the ball's container
     * @param ballRadius The radius of the ball
     * @param ballIndex The ball's index
     * @param ballNumber The number to display on the ball
     */
    constructor(xPos: number, yPos: number, ballRadius: number, ballIndex: number, ballNumber: number)
    {
        super(xPos, yPos);

        this.ballIndex = ballIndex;
        this.ballNumber = ballNumber;

        // Create ball background graphic
        this.ballBackgroundGraphic = new Graphics();
        this.ballBackgroundGraphic
            .beginFill(0xFFFFFF)
            .lineStyle(4, 0x000000)
            .drawCircle(0, 0, ballRadius)
            .endFill();

        // Create ball foreground graphic
        const ballForegroundGraphic: Graphics = new Graphics();
        const ballForegroundGraphicWidth: number = ballRadius * 2;
        const ballForegroundGraphicHeight: number = ballForegroundGraphicWidth / 2;
        ballForegroundGraphic
            .beginFill(0xFFFFFF)
            .lineStyle(2, 0x000000)
            .drawRoundedRect(0, 0, ballForegroundGraphicWidth, ballForegroundGraphicHeight, 15)
            .endFill();
        ballForegroundGraphic.pivot.set(ballForegroundGraphicWidth / 2, ballForegroundGraphicHeight / 2);

        // Create ball number text
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'black',
        });
        this.ballNumberText = new Text(ballNumber, textStyle);
        this.ballNumberText.anchor.set(0.5, 0.5);

        this.getContainer().addChild(this.ballBackgroundGraphic, ballForegroundGraphic, this.ballNumberText);

        this.setBallBackgroundTint(this.getBallColourTint(ballNumber));
    }

    /**
     * Set the tint of the ball's background graphic
     * @param tintColor Desired color
     */
    public setBallBackgroundTint(tintColor: ColorSource): void
    {
        this.ballBackgroundGraphic.tint = tintColor;
    }

    /**
     * Gets the tint associated with a ball number or white if no association is found
     * @param ballNumber Ball number to check for in the ballColorMap
     * @returns A color
     */
    private getBallColourTint(ballNumber: number): ColorSource
    {
        const colorKey: string | undefined = Object.keys(Ball.ballColorMap).find(numberThreshold =>
            ballNumber < Number(numberThreshold));

        return colorKey ? Ball.ballColorMap[colorKey] : BallColors.White;
    }

    /**
     * Set the ball's number text
     * @param ballNumber Number to display
     */
    public setBallNumberText(ballNumber: number): void
    {
        this.ballNumberText.text = ballNumber;
    }

    /**
     * Gets the number displayed on the ball
     * @returns The ball number
     */
    public getBallNumber(): number
    {
        return this.ballNumber;
    }

    /**
     * Gets the ball's index
     * @returns The Ball index
     */
    public getBallIndex(): number
    {
        return this.ballIndex;
    }

    /**
     * Gets the tint of the ball's background graphic
     * @returns A Tint value
     */
    public getTint(): ColorSource
    {
        return this.ballBackgroundGraphic.tint;
    }
}
