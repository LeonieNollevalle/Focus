// React
import React from "react";
// styles
import "../styles/index.css";
import "../styles/player.css";
import "../styles/itemsPreviews.css";
// images
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Player = ({ data, player, handlePlayer }) => (
  <div className={player ? "player-open" : "player-close"}>
    <div className="container-btn-close">
      <button type="button" className="btn-close" onClick={handlePlayer}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
    <div className="container-trailer">
      {data &&
        Object.prototype.hasOwnProperty.call(data, "trailer") &&
        data.trailer && (
          <iframe
            className="Trailer"
            src={data.trailer.replace("watch?v=", "embed/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      {data &&
        Object.prototype.hasOwnProperty.call(data, "trailer") &&
        !data.trailer && <p>Not available</p>}
    </div>
  </div>
);
export default Player;
