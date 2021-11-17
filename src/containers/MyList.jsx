import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Logo, ElementList, LogoMobile, SearchBar } from "../components";
import "../styles/myList.css";
import { AuthContext } from "../contexts/AuthContext";
import { getListofMyList } from "../services/FirebaseRealtimeDatabase";

/* structure du composant myList */
const MyList = () => {
  // Pour les redirections
  const history = useHistory();

  // useContext des différents context
  const authContext = useContext(AuthContext);

  const [itemList, setItemList] = useState([]);
  const [showView, setShowView] = useState(true);
  const [showOrder, setShowOrder] = useState(true);
  const [filteredArr, setFilteredArr] = useState([]);

  /* creation d'une boucle pour appeler plusieurs fois le composant <ElementList /> */
  useEffect(() => {
    (async () => {
      if (authContext.isLogged) {
        const data = await getListofMyList(authContext.userID);
        setItemList(data);
      } else {
        history.push("/");
      }
    })();
  }, []);

  const filterView = () => {
    if (itemList.length === 0) return;
    console.log(itemList);
    setShowView(!showView);
    // Show only viewed movies
    const filteredMovie = [];
    if (showView) {
      for (let i = 0; i < itemList.length; i += 1)
        if (itemList[i].user && itemList[i].user.watch)
          filteredMovie.push(itemList[i]);
    } else {
      for (let i = 0; i < itemList.length; i += 1)
        if (itemList[i].user && !itemList[i].user.watch)
          filteredMovie.push(itemList[i]);
    }
    setFilteredArr(filteredMovie);
  };

  const filterOrder = () => {
    if (itemList.length === 0) return;
    console.log(itemList);
    setShowOrder(!showOrder);
    let filteredMovie = itemList.slice();
    // Show movies order by asc
    if (showOrder) {
      filteredMovie = filteredMovie.sort((a, b) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      });
    }
    // Show movies order by desc
    else {
      filteredMovie = filteredMovie.sort((a, b) => {
        if (a.title < b.title) return 1;
        if (a.title > b.title) return -1;
        return 0;
      });
    }
    setFilteredArr(filteredMovie);
  };

  const handleCancelFilter = () => {
    console.log(itemList);
    setFilteredArr([]);
    setShowView(true);
    setShowOrder(true);
  };

  return (
    <>
      <div className="myList">
        <div className="barre-logo-burger">
          <Logo />
          <SearchBar />
        </div>
        <div className="barre-logo-burger-mobile">
          <LogoMobile />
          <SearchBar />
        </div>

        <div className="container-views-titles">
          <div className="views-titles">
            <div className="viewed-asc">
              <button
                className={`viewed btn-aperture ${showView ? "" : "checked"}`}
                type="button"
                onClick={() => filterView()}
              >
                {showView ? "Not viewed" : "Viewed"}
              </button>
              <button
                type="button"
                className={`button-margin-left btn-aperture ${
                  showOrder ? "" : "checked"
                }`}
                onClick={() => filterOrder()}
              >
                {showOrder ? "Desc" : "Asc"}
              </button>
              {filteredArr.length !== 0 && (
                <button
                  type="button"
                  className="button-margin-left btn-aperture"
                  onClick={handleCancelFilter}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            <h1>MY LIST</h1>
          </div>
        </div>

        <div className="container-items-list">
          {filteredArr.length === 0 &&
            itemList.map((movie) => (
              <ElementList key={movie.id} data={movie} />
            ))}
          {filteredArr.length !== 0 &&
            filteredArr.map((movie) => (
              <ElementList key={movie.id} data={movie} />
            ))}
        </div>
      </div>
    </>
  );
};
export default MyList;
