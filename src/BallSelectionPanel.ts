import {Graphics, Text, TextStyle, ColorSource} from 'pixi.js';
import {Ball} from './Ball';
import {GenericContainer} from './GenericContainer';

export class BallSelectionPanel extends GenericContainer
{
    protected selectionCompleteCallback: Function | undefined;
    protected selectionBalls: Ball[] = [];
    protected selectedBallNumbers: number[] = [];
    private maxSelectableBalls: number;
    private ballRadius: number;
    private ballPadding: number;
    private ballAlpha: number;

    /**
     * Construct a BallSelectionPanel Object
     * @param xPos X position to place the panel's container
     * @param yPos Y position to place the panel's container
     * @param width Width of the background graphic
     * @param height Height of the background graphic
     * @param ballRadius The radius of a ball
     * @param ballPadding The padding applied to the X spacing of a ball
     * @param ballAlpha The alpha value of a ball
     * @param panelTitle The title to display at the top of the panel
     * @param maxSelection The maximum number of balls that can be selected
     * @param selectionCompleteCallback An optional function called once a ball has been selected
     */
    constructor(xPos: number, yPos: number, width: number, height: number,
        ballRadius: number, ballPadding: number, ballAlpha: number, panelTitle: string,
        maxSelection: number, selectionCompleteCallback?: (numberBall: number, tint: ColorSource) => void)
    {
        super(xPos, yPos);

        this.ballRadius = ballRadius;
        this.ballPadding = ballPadding;
        this.ballAlpha = ballAlpha;
        this.maxSelectableBalls = maxSelection;
        this.selectionCompleteCallback = selectionCompleteCallback;

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
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'black',
        });
        const yPositionPadding: number = 10;
        const titleText: Text = new Text(panelTitle, textStyle);
        titleText.position.y = (-height / 2) + yPositionPadding;
        titleText.anchor.set(0.5, 0);
        this.getContainer().addChild(titleText);
    }

    /**
     * Initialise the class causing the creation of the ball grid
     */
    public init(): void
    {
        this.createGridOfBalls(this.ballRadius, this.ballPadding, this.ballAlpha);
    }

    protected createGridOfBalls(ballRadius: number, ballPadding: number, ballAlpha: number)
    {
        const xSpacing: number = (ballRadius * 2) + ballPadding;
        const containerWidth: number = -(this.getContainer().width / 2) + ballRadius + ballPadding;

        for(let ballIndex: number = 0; ballIndex < this.maxSelectableBalls; ballIndex++)
        {
            const selectionBall: Ball = new Ball(
                containerWidth + xSpacing * ballIndex,
                20,
                ballRadius,
                ballIndex,
                0);
            selectionBall.setAlpha(ballAlpha);
            this.selectionBalls.push(selectionBall);
            this.getContainer().addChild(selectionBall.getContainer());
        }
    }

    /**
     * Sets a ball to play a matching animation if its number matches the passed in argument
     * @param ballNumber Ball number to check for a match
     */
    public setBallMatching(ballNumber: number): void
    {
        const ballIndex: number = this.selectedBallNumbers.findIndex((value: number) => value === ballNumber);
        this.selectionBalls[ballIndex].AnimateScale(1.1, 1.1, 0.5, Infinity, true);
    }

    /**
     * Sets the ball details to be displayed on the panel
     * @param ballNumber The number to display on the ball
     * @param tint The tint to apply to the balls background graphic
     * @param alpha The alpha value to animate the ball to
     * @param time The time it takes to animate the alpha
     * @param ballIsFinal Are this the finalised details for the ball?
     */
    public setBallSelected(ballNumber: number, tint: ColorSource, alpha: number, time: number, ballIsFinal: boolean = true): void
    {
        const ballIndex: number = this.selectedBallNumbers.length;
        this.selectionBalls[ballIndex].AnimateAlpha(alpha, time);
        this.selectionBalls[ballIndex].setBallNumberText(ballNumber);
        this.selectionBalls[ballIndex].setBallBackgroundTint(tint);

        if(ballIsFinal)
        {
            this.selectedBallNumbers.push(ballNumber);

            if(this.selectionCompleteCallback !== undefined)
                this.selectionCompleteCallback(ballNumber);
        }
    }

    /**
     * Gets the current array of selected ball numbers
     * @returns An array of final selected ball numbers
     */
    public getSelectedBallNumbers(): number[]
    {
        return this.selectedBallNumbers;
    }

    /**
     * Gets the maximum number of selectable balls in this panel
     * @returns Value for the Maximum selectable balls
     */
    public getMaxSelectableBalls(): number
    {
        return this.maxSelectableBalls;
    }

    /**
     * Gets a Ball object from this panel
     * @param index The index of the Ball object to retreive
     * @returns A Ball object
     */
    public getBall(index: number): Ball
    {
        return this.selectionBalls[index];
    }

    /**
     * Checks if this panel has completed all of its ball selections
     * @returns True if the number of balls selected in this panel is equal to the maximum selectable balls this panel can contain
     */
    public hasCompletedAllSelections(): boolean
    {
        return this.selectedBallNumbers.length === this.maxSelectableBalls;
    }
}
