import {Application, ColorSource, Text, TextStyle} from 'pixi.js';
import {Paytable} from './Paytable';
import {PickableBallSelectionPanel} from './PickableBallSelectionPanel';
import {BallSelectionPanel} from './BallSelectionPanel';
import {Button} from './Button';
import {Utility} from './Utility';
import {WinMessagePanel} from './WinMessagePanel';
import {Ball} from './Ball';

export class Game
{
	private app: Application;
	private paytable: Paytable;
	private chosenBallsPanel: BallSelectionPanel;
	private winningBallsPanel: BallSelectionPanel;
	private drawnBallsPanel: BallSelectionPanel;
	private pickableBallsPanel: PickableBallSelectionPanel;
	private chooseBallsButton: Button;
	private luckyDipButton: Button;
	private drawButton: Button;
	private restartButton: Button;
	private winMessagePanel: WinMessagePanel;

	// A count of how many matching balls the player has
	private matchingBallsCount = 0;
	// During the drawing phase how many fake balls should be shown before the final is picked
	private readonly numberOfFakeDrawBallsToShow: number = 20;
	// During the drawing phase how much time should there be between the fake balls changing (s)
	private readonly timeBetweenFakeBallsChanging: number = 0.1;

	/**
	 * Construct a new Game object
	 * @param app PixiJS application
	 * @param restartCallback A function called once the restart button is clicked
	 */
	constructor(app: Application, restartCallback: () => void)
	{
		this.app = app;

		// Create the paytable instance
		this.paytable = new Paytable(315, 290, 300, 50, 65);
		this.app.stage.addChild(this.paytable.getContainer());

		//Create choose balls button
		this.chooseBallsButton = new Button(725, 175, 345, 100, "CHOOSE YOUR NUMBERS", this.startGame.bind(this, false));
		this.chooseBallsButton.AnimateScale(1.1, 1.1, 0.75, Infinity, true);
		this.app.stage.addChild(this.chooseBallsButton.getContainer());

		//Create lucky dip balls button
		this.luckyDipButton = new Button(725, 350, 350, 100, "LUCKY DIP", this.startGame.bind(this, true));
		this.luckyDipButton.AnimateScale(1.1, 1.1, 0.75, Infinity, true);
		this.app.stage.addChild(this.luckyDipButton.getContainer());

		//Create draw balls button
		this.drawButton = new Button(725, 625, 350, 100, "DRAW", this.startDraw.bind(this));
		this.drawButton.AnimateScale(1.1, 1.1, 0.75, Infinity, true);
		this.drawButton.setAlpha(0);
		this.drawButton.setDisableInteractable();
		this.app.stage.addChild(this.drawButton.getContainer());

		//Create game restart button
		this.restartButton = new Button(725, 475, 350, 100, "RESTART GAME", restartCallback);
		this.restartButton.AnimateScale(1.1, 1.1, 0.75, Infinity, true);
		this.restartButton.setAlpha(0);
		this.restartButton.setDisableInteractable();
		this.app.stage.addChild(this.restartButton.getContainer());

		// Create the pickable balls panel
		this.pickableBallsPanel = new PickableBallSelectionPanel(710, 280, 607, 475, 30, 7, 1, "", 6, 59, this.onBallSelected.bind(this));
		this.pickableBallsPanel.init();
		this.pickableBallsPanel.setAlpha(0);
		this.app.stage.addChild(this.pickableBallsPanel.getContainer());

		// Create the chosen numbers panel
		this.chosenBallsPanel = new BallSelectionPanel(220, 625, 407, 125, 30, 7, 0, "YOUR NUMBERS", 6, this.onBallChosen.bind(this));
		this.chosenBallsPanel.init();
		this.chosenBallsPanel.setAlpha(0);
		this.app.stage.addChild(this.chosenBallsPanel.getContainer());

		// Create the winning numbers panel
		this.winningBallsPanel = new BallSelectionPanel(725, 625, 407, 125, 30, 7, 1, "WINNING NUMBERS", 6, this.onBallWon.bind(this));
		this.winningBallsPanel.init();
		this.winningBallsPanel.setAlpha(0);
		this.app.stage.addChild(this.winningBallsPanel.getContainer());

		// Create the drawn numbers panel
		this.drawnBallsPanel = new BallSelectionPanel(710, 265, 587, 200, 45, 7, 1, "DRAW", 6, undefined);
		this.drawnBallsPanel.init();
		this.drawnBallsPanel.setAlpha(0);
		this.app.stage.addChild(this.drawnBallsPanel.getContainer());

		// Create the win message panel
		this.winMessagePanel = new WinMessagePanel(725, 265, 500, 150, "");
		this.winMessagePanel.setAlpha(0);
		this.app.stage.addChild(this.winMessagePanel.getContainer());

		this.createGameTitle();
	}

	private createGameTitle(): void
	{
		const textStyle = new TextStyle({
			fontFamily: 'Comic Sans MS',
			fontSize: 48,
			fill: 'white'
		});
		const gameTitleText: Text = new Text("LOTTERY GAME!", textStyle)
		gameTitleText.position.set(0, 40);

		this.app.stage.addChild(gameTitleText);
	}

	/**
	 * Starts the game by either enabling interaction with the pickable balls or automatically picking them
	 * @param autoPick Should the game auto pick the player's numbers?
	 */
	private async startGame(autoPick: boolean): Promise<void>
	{
		this.chooseBallsButton.AnimatePosition(2000, this.chooseBallsButton.getY(), 0.75);
		await this.luckyDipButton.AnimatePosition(2000, this.luckyDipButton.getY(), 0.75);

		this.pickableBallsPanel.AnimateAlpha(1, 1);
		await this.chosenBallsPanel.AnimateAlpha(1, 1);

		this.pickableBallsPanel.start(autoPick);
	}

	/**
	 * Called when a ball is added to the winning balls panel
	 * This will check if the winning ball matches any of the balls in the player's chosen panel
	 * and check for gameover
	 * @param ballNumber The ball number won
	 */
	private onBallWon(ballNumber: number): void
	{
		this.checkForMatchingBalls(ballNumber);
		this.checkGameOver();
	}

	/**
	 * If a matching ball is found an animtion will play on ball in both the player's chosen panel
	 * and the winning balls panel, as well as increase the matching balls count
	 * @param ballNumber The winning ball number to check
	 */
	private checkForMatchingBalls(ballNumber: number): void
	{
		const hasMatchingBallBeenWon: number = this.chosenBallsPanel.getSelectedBallNumbers().
			findIndex((value: number) => value === ballNumber);

		if(hasMatchingBallBeenWon !== -1)
		{
			this.winningBallsPanel.setBallMatching(ballNumber);
			this.chosenBallsPanel.setBallMatching(ballNumber);
			this.matchingBallsCount++;
		}
	}

	/**
	 * Checks for the game over condition, that is all ball have been drawn
	 * this will start the drawn balls panel to fade out and unpon completing show
	 * the win message, animate the paytable and show the restart button
	 */
	private async checkGameOver(): Promise<void>
	{
		if(this.drawnBallsPanel.hasCompletedAllSelections())
		{
			await this.drawnBallsPanel.AnimateAlpha(0, 1);

			this.paytable.setWinningPaytableItem(this.matchingBallsCount);
			this.setWinPanelMessage();

			this.restartButton.AnimateAlpha(1, 1);
			this.restartButton.setEnableInteractable();
		}
	}

	/**
	 * Sets the text and text color on the win message
	 * this will show either a win or a lose message depending on the number of matching balls
	 */
	private setWinPanelMessage(): void
	{
		if(this.matchingBallsCount < this.paytable.getMinimumMatchesForPrize())
		{
			this.winMessagePanel.setMessageTint('red');
			this.winMessagePanel.setMessageText("NOT ENOUGH MATCHES")
		}
		else
		{
			this.winMessagePanel.setMessageTint('green');
			this.winMessagePanel.setMessageText("YOU MATCHED " + this.matchingBallsCount +
				" BALLS\nAND WON " + this.paytable.getWonPrize(this.matchingBallsCount));
		}

		this.winMessagePanel.AnimateAlpha(1, 0.5);
	}

	/**
	 * Starts the ball drawing behavior, this animates the draw button and pickableballs panel
	 * and once complete then shows the winning balls panel and drawn balls panel and once complete
	 * starts the ball drawing animation
	 */
	private async startDraw(): Promise<void>
	{
		this.drawButton.AnimatePosition(2000, this.drawButton.getY(), 0.75);
		await this.pickableBallsPanel.AnimateAlpha(0, 1);

		this.winningBallsPanel.AnimateAlpha(1, 1);
		await this.drawnBallsPanel.AnimateAlpha(1, 1);

		this.animateBallDrawing();
	}

	/**
	 * A loop for going through the number of balls to draw, this will wait for a ball animation to complete
	 * before setting the final drawn ball and going to the next iteration
	 */
	private async animateBallDrawing(): Promise<void>
	{
		for(let ballIndex: number = 0; ballIndex < this.drawnBallsPanel.getMaxSelectableBalls(); ballIndex++)
		{
			await this.setFakeDrawnBall();
			this.setFinalDrawnBall();
		}
	}

	/**
	 * Sets the current ball being drawn to a random ball after a set interval, giving the effect
	 * that it is flicking through different balls to choose
	 * @returns Resolved once the fake ball drawing sequence is complete
	 */
	private setFakeDrawnBall(): Promise<void>
	{
		return new Promise((resolve) =>
		{
			let numberOfFakeBallsShown: number = 0;
			const switchBallInterval = setInterval(() => 
			{
				const tempDrawnBall: Ball = this.getRandomDrawball();
				this.drawnBallsPanel.setBallSelected(tempDrawnBall.getBallNumber(), tempDrawnBall.getTint(), 1, 0, false);

				numberOfFakeBallsShown++;

				if(numberOfFakeBallsShown === this.numberOfFakeDrawBallsToShow)
				{
					resolve();
					clearInterval(switchBallInterval);
				}
			}, 1000 * this.timeBetweenFakeBallsChanging);
		});
	}

	/**
	 * Gets a random ball from the pickable ball panel
	 * @returns A random Ball
	 */
	private getRandomDrawball(): Ball
	{
		let randomBallIndex: number;
		do
		{
			randomBallIndex = Utility.getRandomNumber(this.pickableBallsPanel.getNumberOfPickableBalls());
		} while(this.drawnBallsPanel.getSelectedBallNumbers().includes(this.pickableBallsPanel.getBall(randomBallIndex).getBallNumber()));

		return this.pickableBallsPanel.getBall(randomBallIndex);
	}

	/**
	 * Selects a final drawn ball and sets the details of it into the drawn balls panel and winning balls panel
	 */
	private setFinalDrawnBall(): void
	{
		const finalDrawnBall: Ball = this.getRandomDrawball();
		this.drawnBallsPanel.setBallSelected(finalDrawnBall.getBallNumber(), finalDrawnBall.getTint(), 1, 0);
		this.winningBallsPanel.setBallSelected(finalDrawnBall.getBallNumber(), finalDrawnBall.getTint(), 1, 0);
	}

	/**
	 * Sets details of the selected ball into the chosen balls panel and the pickable balls panel
	 * @param ballNumber The ball number of the selected ball
	 * @param tint The tint of the selected ball
	 */
	private onBallSelected(ballNumber: number, tint: ColorSource): void
	{
		this.chosenBallsPanel.setBallSelected(ballNumber, tint, 1, 1);
		this.pickableBallsPanel.setBallSelected(ballNumber);
	}

	/**
	 * Called when a ball is added to the player's chosen balls panel
	 * Once all balls have been chosen this will disable ineraction with any more balls
	 * and show the "Draw" button
	 */
	private onBallChosen(): void
	{
		if(this.chosenBallsPanel.hasCompletedAllSelections())
		{
			this.pickableBallsPanel.disableInteractable();
			this.drawButton.AnimateAlpha(1, 1);
			this.drawButton.setEnableInteractable();
		}
	}
}
