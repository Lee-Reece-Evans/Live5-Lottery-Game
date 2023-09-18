import {ColorSource} from 'pixi.js'
import {Ball} from './Ball';

export class PickableBall extends Ball
{
    private ballPickedCallback: Function | undefined;

    /**
     * Construct a new PickableBall object
     * @param xPos X position to place the pickable ball's container
     * @param yPos X position to place the pickable ball's container
     * @param ballRadius The radius of the ball
     * @param ballIndex The ball's index
     * @param ballNumber The number to display on the ball
     * @param callback Function to call when a ball is picked
     */
    constructor(xPos: number, yPos: number, ballRadius: number, ballIndex: number,
        ballNumber: number, ballPickedcallback?: (ballNumber: number, tint: ColorSource) => void)
    {
        super(xPos, yPos, ballRadius, ballIndex, ballNumber);

        this.ballPickedCallback = ballPickedcallback;

        // Listen for a mouse pointer down event on the background graphic
        this.ballBackgroundGraphic.on("pointerdown", this.pickBall.bind(this));

        this.setDisableInteractable();
    }

    /**
     * Picks the ball to be used as the player's chosen ball
     */
    public pickBall(): void
    {
        // Create the some particle splash when ball is selected.
        this.setDisableInteractable();
        this.AnimateAlpha(0.5, 1);

        if(this.ballPickedCallback !== undefined)
            this.ballPickedCallback(this.getBallNumber(), this.getTint());
    }

    /**
     * Enables the interactability of this pickable ball
     */
    public setEnableInteractable(): void
    {
        this.ballBackgroundGraphic.eventMode = "static";
        this.ballBackgroundGraphic.cursor = 'pointer';
    }

    /**
     * Disables the interactability of this pickable ball
     */
    public setDisableInteractable(): void
    {
        this.ballBackgroundGraphic.eventMode = "none";
        this.ballBackgroundGraphic.cursor = 'default';
    }
}
