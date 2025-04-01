import Player from "./modules/player.js";
import UI from "./controllers/ui.js";
import Game from "./controllers/game.js";

window.addEventListener("load", () => {
    const storedPlayers = JSON.parse(localStorage.getItem("players"));
    let players = [];

    if (storedPlayers) {
        players = storedPlayers.map(data => new Player(data.name, data.mark));
    } else {
        players.push(new Player("Player 1", "x", true));
        players.push(new Player("Player 2", "o", false));

        localStorage.setItem("players", JSON.stringify(players));
    }

    const ui = new UI(players);
    const game = new Game(players);
});