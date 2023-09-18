export class Utility
{
    /**
     * Gets random number between the range 0 (inclusive) and max (non inclusive)
     * @param max The maximum number in the range (non inclusive)
     * @returns A random number
     */
    public static getRandomNumber(max: number): number
    {
        return Math.floor(Math.random() * max);
    }
}
