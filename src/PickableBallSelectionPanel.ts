import {Graphics, ColorSource} from 'pixi.js'
import {BallSelectionPanel} from './BallSelectionPanel';
import {PickableBall} from './PickableBall'
import {Utility} from './Utility';

export class PickableBallSelectionPanel extends BallSelectionPanel
{
    protected override selectionBalls: PickableBall[] = [];
    private readonly numberOfPickableBalls: number;

    /**
     * Construct a PickableBallSelectionPanel object
     * @param xPos X position to place the panel's container
     * @param yPos Y position to place the panel's container
     * @param width Width of the background graphic
     * @param height Height of the background graphic
     * @param ballRadius The radius of a ball
     * @param ballPadding The padding applied to the X and Y spacing of a ball
     * @param ballAlpha The alpha value of a ball
     * @param panelTitle The title to display at the top of the panel
     * @param maxSelection The maximum number of pickable balls to display in the grid
     * @param maxPickableBalls The maximum number of balls that can be displayed in the grid
     * @param selectionCompleteCallback An optional function called once a ball has been selected
     */
    constructor(xPos: number, yPos: number, width: number, height: number,
        ballRadius: number, ballPadding: number, ballAlpha: number, panelTitle: string, maxSelection: number,
        maxPickableBalls: number, selectionCompleteCallback?: (numberBall: number, tint: ColorSource) => void)
    {
        super(xPos, yPos, width, height, ballRadius, ballPadding, ballAlpha, panelTitle, maxSelection, selectionCompleteCallback);

        this.numberOfPickableBalls = maxPickableBalls;

        // Panel background graphic
        const backgroundGraphic: Graphics = new Graphics();
        backgroundGraphic
            .beginFill(0xFFFFFF)
            .lineStyle(2, 0x000000)
            .drawRoundedRect(0, 0, width, height, 10)
            .endFill();
        backgroundGraphic.alpha = 0.7;
        backgroundGraphic.pivot.set(width / 2, height / 2);
        this.getContainer().addChild(backgroundGraphic);
    }

    protected override createGridOfBalls(ballRadius: number, ballPadding: number, ballAlpha: number): void
    {
        const maxColumns: number = 9
        const xSpacing: number = (ballRadius * 2) + ballPadding;
        const ySpaceing: number = (ballRadius * 2) + ballPadding;
        const containerWidth: number = -(this.getContainer().width / 2) + ballRadius + ballPadding;
        const containerHeight: number = -(this.getContainer().height / 2) + ballRadius + ballPadding;

        let ballIndex = 0;
        let rowCount = 0;
        do
        {
            for(let columnIndex: number = 0; columnIndex < maxColumns; columnIndex++)
            {
                if(ballIndex >= this.numberOfPickableBalls)
                    break;

                const ballNumber: number = ballIndex + 1;
                const pickableBall: PickableBall = new PickableBall(
                    containerWidth + xSpacing * columnIndex,
                    containerHeight + ySpaceing * rowCount,
                    ballRadius,
                    ballIndex,
                    ballNumber,
                    this.selectionCompleteCallback?.bind(this));
                pickableBall.setAlpha(ballAlpha);
                this.selectionBalls.push(pickableBall);
                this.getContainer().addChild(pickableBall.getContainer());

                ballIndex++;
            }
            rowCount++;
        } while(ballIndex < this.numberOfPickableBalls)
    }

    /**
     * Starts the ball picking behaviour
     * @param autoPick Should the balls be picked automatically?
     */
    public start(autoPick: boolean): void
    {
        autoPick ? this.autoPick() : this.enableInteractable();
    }

    /**
     * Start autopicking the player's chosen balls
     */
    private autoPick(): void
    {
        for(let pickCount: number = 0; pickCount < this.getMaxSelectableBalls(); pickCount++)
            setTimeout(this.pickRandomBall.bind(this), 1000 * pickCount);
    }

    /**
     * Picks a random ball with duplicate prevention by checking if the list of selected balls
     * already includes the random one picked
     */
    private pickRandomBall(): void
    {
        let randomBallIndex: number = 0;
        do
        {
            randomBallIndex = Utility.getRandomNumber(this.numberOfPickableBalls);
        } while(this.selectedBallNumbers.includes(this.getBall(randomBallIndex).getBallNumber()));

        this.getBall(randomBallIndex).pickBall();
    }

    /**
     * Override of the setBallSelected method used to only add the selected ball number to the selectedBallNumbers array
     * @param ballNumber The ball number to add
     */
    public override setBallSelected(ballNumber: number): void
    {
        this.selectedBallNumbers.push(ballNumber);
    }

    /**
     * Disable the interaction with all the pickable balls
     */
    public disableInteractable(): void
    {
        for(const pickableBall of this.selectionBalls)
            pickableBall.setDisableInteractable();
    }

    /**
     * Enable the interaction with all the pickable balls
     */
    private enableInteractable(): void
    {
        for(const pickableBall of this.selectionBalls)
            pickableBall.setEnableInteractable();
    }

    /**
     * Gets the number of balls that can be selected
     * @returns Number of pickable balls
     */
    public getNumberOfPickableBalls(): number
    {
        return this.numberOfPickableBalls;
    }

    /**
     * Gets a PickableBall object
     * @param index The index of the pickable ball
     * @returns A Pickable ball object
     */
    public override getBall(index: number): PickableBall
    {
        return this.selectionBalls[index];
    }
}
