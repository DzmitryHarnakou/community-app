import { Game } from 'models/games';

import Promise = require('bluebird');

export abstract class MyGamesRepository {

    public abstract deleteGame(gameThaNeedToDelete: Game): Promise<Game[]>;
    public abstract addGame(newGame: Game): Promise<Game>;
    public abstract editGame(data: Game): Promise<Game[]>;
    public abstract getGames(userId: number):  Promise<Game[]>;
}
