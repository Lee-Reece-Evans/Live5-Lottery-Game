import {Application, Ticker} from "pixi.js";
import {Game} from './Game'

export class App
{
    private app: Application;

    /**
     * Construct a new PIXI application and start a new game instance
     */
    constructor()
    {
        this.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            backgroundColor: 0x6495ed,
            width: 1024,
            height: 720,
            antialias: true
        });

        new Game(this.app, this.restartGame.bind(this));
    }

    /**
     * Clear the Pixi Application and create a new App
     */
    public restartGame(): void
    {
        this.app.stage.destroy(true);
        this.app.ticker.destroy();
        Ticker.shared.destroy();
        new App();
    }
}

/**
 * Upon the browser window loading create a new App
 */
window.onload = () =>
{
    new App();
}
