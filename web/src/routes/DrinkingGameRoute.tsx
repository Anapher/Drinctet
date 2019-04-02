import React from "react";
import DrinkingGame from "../features/drinking-games/DrinkingGame";
import game from "../features/drinking-games/registrations";

export default function DrinkingGameRoute() {
    return (
        <div>
            {game.map(x => (
                <DrinkingGame key={x.name} game={x} />
            ))}
        </div>
    );
}
