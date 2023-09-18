import {Container, Ticker} from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'

/**
 * A base class with generic behaviour involving the container
 */
export class GenericContainer
{
    private container: Container;

    /**
     * Construct a new Generic object
     * @param xPos X position to place the container
     * @param yPos Y position to place the container
     */
    constructor(xPos: number, yPos: number)
    {
        Ticker.shared.add(this.update);

        this.container = new Container();

        this.setPosition(xPos, yPos);
    }

    /**
     * Positions the container at a desired location
     * @param x x position to place the container
     * @param y y position to place the container
     */
    public setPosition(x: number, y: number): void
    {
        this.container.position.set(x, y);
    }

    /**
     * Immediately sets the containers alpha value.
     * @param alpha value between 0 and 1
     */
    public setAlpha(alpha: number): void
    {
        this.container.alpha = alpha;
    }

    /**
     * Animated the alpha of the container, effecting all the elements contained within it
     * @param newValue The value that should be animated to
     * @param Time The time it takes to animate
     */
    public AnimateAlpha(newValue: number, Time: number): Promise<void>
    {
        return new Promise((resolve) =>
        {
            new TWEEN.Tween(this.container).to({alpha: newValue}, Time * 1000).start().onComplete(() => resolve());
        });
    }

    /**
     * Animates the position of the container and all the elements contained within it
     * @param newX New x position to travel to
     * @param newY New y position to trabel to
     * @param Time The time it takes to animate
     */
    public AnimatePosition(newX: number, newY: number, Time: number): Promise<void>
    {
        return new Promise((resolve) =>
        {
            new TWEEN.Tween(this.container).to({x: newX, y: newY}, Time * 1000).start().onComplete(() => resolve());
        });
    }

    /**
     * Animates the scale of the container and all the elements contained within it
     * @param newX Desired x scale
     * @param newY Desired y scale
     * @param Time The time it takes to animate
     * @param repeat How many times should the animation repeat?
     * @param yoyo Should the animaition bounce between its original and new values? (works with repeat)
     */
    public AnimateScale(newX: number, newY: number, Time: number, repeat: number, yoyo: boolean): void
    {
        new TWEEN.Tween(this.container.scale).to({x: newX, y: newY}, Time * 1000).start().repeat(repeat).yoyo(yoyo);
    }

    /**
     * Update method added to the Ticker
     */
    public update(): void
    {
        TWEEN.update();
    }

    /**
     * Gets the container that elements are added to
     * @returns the container
     */
    public getContainer(): Container
    {
        return this.container;
    }

    /**
     * Gets the containers x position
     * @returns x position
     */
    public getX(): number
    {
        return this.container.position.x;
    }

    /**
     * Gets the container y position
     * @returns Y position
     */
    public getY(): number
    {
        return this.container.position.y;
    }
}
