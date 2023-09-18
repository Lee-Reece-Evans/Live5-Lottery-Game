import {PaytableItem} from './PaytableItem'
import {GenericContainer} from './GenericContainer';

type MatchingBallsPrizeMap = {[numberThreshold: string]: string};

export class Paytable extends GenericContainer
{
    private paytableItems: PaytableItem[] = [];

    private matchingBallsPrizeMap: MatchingBallsPrizeMap = {
        '3': '50',
        '4': '100',
        '5': '200',
        '6': '500'
    };

    /**
     * Construct a paytable object
     * @param xPos X position to place the paytable's container
     * @param yPos Y position to place the paytable's container
     * @param width Width of a paytable item's background graphic
     * @param height Height of a paytable item's background graphic
     * @param ySpacing Vertical Space between each of the paytable items
     */
    constructor(xPos: number, yPos: number, width: number, height: number, ySpacing: number)
    {
        super(xPos, yPos);

        this.createPaytable(width, height, ySpacing);;
    }

    private createPaytable(width: number, height: number, ySpacing: number): void
    {
        let loopCount = 0;
        for(const matchingBallCount in this.matchingBallsPrizeMap)
        {
            const prize: string = this.matchingBallsPrizeMap[matchingBallCount];
            const paytableItem: PaytableItem = new PaytableItem(
                0,
                loopCount * ySpacing,
                width,
                height,
                matchingBallCount,
                prize);
            this.paytableItems.push(paytableItem);
            this.getContainer().addChild(paytableItem.getContainer());

            loopCount++;
        }
        this.getContainer().pivot.set(this.getContainer().width / 2, this.getContainer().height / 2);
    }

    /**
     * Sets a paytable item to play a scaling animation if it correspondes with the number of matching balls.
     * @param matchCount The number of matching balls
     */
    public setWinningPaytableItem(matchCount: number): void
    {
        const paytableItemIndex: number = Object.keys(this.matchingBallsPrizeMap).
            findIndex((value: string) => value === String(matchCount));

        if(paytableItemIndex !== -1)
            this.paytableItems[paytableItemIndex].AnimateScale(1.1, 1.1, 0.5, Infinity, true);
    }

    /**
     * Gets the prize associated with a number of matching balls
     * @param matchingBallsCount The number of matching balls
     * @returns A prize amount for the number of matching balls
     */
    public getWonPrize(matchingBallsCount: number): string
    {
        return this.matchingBallsPrizeMap[String(matchingBallsCount)];
    }

    /**
     * gets the minimum number of matching balls required to win a prize
     * @returns First entry in the matchingBallsPrizeMap for the minimum matching balls prize
     */
    public getMinimumMatchesForPrize(): number
    {
        return Number(Object.keys(this.matchingBallsPrizeMap).at(0));
    }
}
