import React, { useState, useEffect } from "react";
// import "../styles/SearchBar.css";
import "../styles/SearchBar.scss";
import { tmdbSearchMovies } from "../services/TheMovieDbFunctions";
import ListSearch from "./ListSearch";

const SearchBar = () => {
  // states
  const [search, setSearch] = useState("");
  const [listTitle, setListTitle] = useState([]);
  const [searchById, setSearchById] = useState(null);
  console.log(searchById);

  // fonction qui appelle toutes les infos du film en fonction de l'id récupéré (searchById);CONTINUER ICI------

  useEffect(() => {
    // fonction qui recherche un titre de film
    const run = async () => {
      if (search.length >= 3) {
        const result = await tmdbSearchMovies(search);

        // cette fonction limite à 5 la liste des films trouvés
        // Limitation du nombre de caractères affichés à 40
        const map = result.map((res, index) =>
          index < 5 ? (
            <li
              /* recuperation des id au click sur les li */
              key={res.id}
              onClick={() => {
                setSearchById(res.id);
              }}
              role="presentation"
            >
              {res.title.length > 40
                ? `${res.title.substring(0, 40)}...`
                : res.title}
            </li>
          ) : (
            ""
          )
        );

        setListTitle(map);
      } else {
        setListTitle([]);
      }
    };
    run();
  }, [search]);

  return (
    <>
      <div className="search">
        <input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          type="text"
          className="searchTerm"
          placeholder="Search..."
          value={search}
        />
        <button type="submit" className="searchButton">
          <i className="fa fa-search" />
        </button>
      </div>
      <ListSearch listTitle={listTitle} search={search} />
    </>
  );
};

export default SearchBar;
