import React, { useEffect, useState } from "react";
import Hamburger from "hamburger-react";
import "../styles/category.css";
import BackgroundImage from "../components/BackgroundImage";
import ItemsPreviews from "../components/ItemsPreviews";
import "../styles/backgroundImage.css";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import LogoMobile from "../components/LogoMobile";

import { tmdbMovieUpcomming } from "../services/TheMovieDbFunctions";

const Category = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const run = async () => {
      const data = await tmdbMovieUpcomming();
      console.log(data);
      const map = data.map((datamovie) => (
        <ItemsPreviews key={datamovie.id} data={datamovie} />
      ));
      setMovies(map);
    };
    run();
  }, []);

  return (
    <>
      <BackgroundImage />

      <div className="container-category">
        <div className="barre-header">
          <div className="logo-search">
            <Logo />
            <LogoMobile />
            <SearchBar />
          </div>
          <Hamburger />
        </div>

        <div className="container-previous-items-center">
          <div className="title-category">
            <h1>Category</h1>
          </div>
          <div className="container-previous-items">{movies}</div>
        </div>
      </div>
    </>
  );
};
export default Category;
