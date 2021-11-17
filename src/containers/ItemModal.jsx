import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { Rating } from "react-simple-star-rating";
import { SignContext } from "../contexts/SignContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  addMovie,
  addMovieToMyList,
  removeFromMyList,
  updateUserMyList,
  getListofMyList,
  getMovieofMyList,
  getMovieListByID,
  updateMovie,
} from "../services/FirebaseRealtimeDatabase";
import { ModalContext } from "../contexts/ModalContext";
// import { ItemsPreviews } from "../components";
// import westworlded from "../assets/images/westworlded.jpg";
// import imgNet from "../assets/images/netflix.png";
// import imgCanal from "../assets/images/canal.png";
import "../styles/itemModal.css";

const ItemModal = () => {
  const signinContext = useContext(SignContext);
  const authContext = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const modalContext = useContext(ModalContext);
  Modal.setAppElement("#root");

  // récupération des icones plateformes
  let icones;
  if (modalContext.infosMovie.providers) {
    icones = modalContext.infosMovie.providers.map((icon) => (
      <img src={icon.img} alt={icon.providers} title={icon.providers} />
    ));
  }

  /* Modal Toggle Open/Closed
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true);
  };
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };
  CE CODE EST DANS MODALCONTEXT
  */

  /**
   * Get user Mylist if Connected and format to get only ID
   */
  const [userMovieMyListID, setUserMovieMyListID] = useState([]);
  useEffect(() => {
    (async () => {
      if (!authContext.isLogged) return;
      const userMyList = await getListofMyList(authContext.userID);
      setUserMovieMyListID(userMyList.map((movie) => movie.id));
    })();
  }, []);

  /**
   * State who set the text in Button Add / Remove to MyList
   */
  const [buttonType, setButtonType] = useState(null);

  /**
   * Change the button text
   * @param {boolean} bool If add or remove but in Boolean
   */
  const buttonMyList = (bool) => {
    // Si ajouté
    if (bool) {
      setButtonType(
        <>
          <i className="icon-plus" /> Add to my list
        </>
      );
    } else {
      setButtonType(
        <>
          <i className="icon-cancel" /> Remove
          <br />
          from my list
        </>
      );
    }
  };

  /**
   * Add the movie to user list if connected
   */
  const handleAddToMyList = async () => {
    try {
      // Ajouter a MaList
      if (authContext.isLogged) {
        // Get if this movie already exit in db
        const movieAlreadyExist = await getMovieListByID(
          modalContext.infosMovie.id
        );
        // If Not exist
        if (!movieAlreadyExist) {
          // try to add this movie to the database
          const movieData = {
            title: modalContext.infosMovie.title || "Not documented",
            poster: modalContext.infosMovie.background || "Not documented",
            author: modalContext.infosMovie.author || "Not documented",
            date: modalContext.infosMovie.date.base || "Not documented",
            duration: modalContext.infosMovie.duration.base || "Not documented",
          };
          await addMovie(modalContext.infosMovie.id, movieData);
        }
        // If Exist
        else {
          // try to update this movie to the database
          const movieData = {
            title: modalContext.infosMovie.title || "Not documented",
            poster: modalContext.infosMovie.background || "Not documented",
            author: modalContext.infosMovie.author || "Not documented",
            date: modalContext.infosMovie.date.base || "Not documented",
            duration: modalContext.infosMovie.duration.base || "Not documented",
          };
          await updateMovie(modalContext.infosMovie.id, movieData);
        }
        // get if user already rated this movie
        const movieInfo = await getMovieofMyList(
          authContext.userID,
          modalContext.infosMovie.id
        );
        // update to add user on movie
        await addMovieToMyList(
          authContext.userID,
          modalContext.infosMovie.id,
          movieInfo.user.rating || null
        );
        // Change button to "Remove from my list"
        buttonMyList(false);
      } else {
        // Demander de se connecter
        signinContext.showSignIn();
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Remove the movie from the user list if connected
   */
  const handleRemoveOfMyList = async () => {
    try {
      // Remove movie from MaList
      if (authContext.isLogged) {
        await removeFromMyList(authContext.userID, modalContext.infosMovie.id);
        // Change button to "Add to my list"
        buttonMyList(true);
      } else {
        // Demander de se connecter
        signinContext.showSignIn();
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Handle the rating of a movie but save only if connected
   * @param {number} value Rating number /5
   * @param {number} movieID Movie ID
   * @returns Because eslint will not work without this
   */
  const handleRating = (value, movieID) => {
    setRating(value);
    // si connecter enregistrer le rating
    if (authContext.isLogged) {
      // Connected
      updateUserMyList(authContext.userID, movieID, {
        rating: value,
      });
      // Change button to "Remove from my list"
      buttonMyList(false);
    }
    return true;
  };

  return (
    <div className="itemModal">
      {/* <button type="button" onClick={setModalIsOpenToTrue}>
        Open Modal
      </button> */}
      <Modal
        portalClassName="itemModal"
        className="itemModal"
        overlayClassName="modalOverlay"
        isOpen={modalContext.modalIsOpen}
        onRequestClose={() => {
          modalContext.setModalIsOpen(false);
        }}
      >
        <main className="modalContent">
          <div className="top-thumbnail">
            <img src={modalContext.infosMovie.background} alt="" />
            <h1>{modalContext.infosMovie.title}</h1>
            <a
              href="#close"
              title="Close"
              className="close"
              onClick={modalContext.setModalIsOpenToFalse}
            >
              X
            </a>
          </div>
          <div className="bottom-infos">
            <div className="bottom-infos-grid">
              <div className="bottom-infos-grid-creators">
                {modalContext.infosMovie.author}
              </div>
              <div className="bottom-infos-grid-date">
                {modalContext.infosMovie.date &&
                  `${modalContext.infosMovie.date.year}`}
              </div>
              <div className="bottom-infos-grid-length">
                {modalContext.infosMovie.duration &&
                  `${modalContext.infosMovie.duration.hours}h ${modalContext.infosMovie.duration.minutes} min`}
              </div>
              <div className="bottom-infos-grid-starRater">
                <Rating
                  onClick={(value) =>
                    handleRating(value, modalContext.infosMovie.id)
                  }
                  ratingValue={rating}
                />
              </div>
              <div className="bottom-infos-grid-availableOn">
                Available On <i className="fa fa-play-circle-o" />
              </div>
              <div className="bottom-infos-grid-addToMyList">
                {userMovieMyListID.includes(modalContext.infosMovie.id) && (
                  <button
                    className="btn-addToMyList"
                    type="button"
                    onClick={handleRemoveOfMyList}
                  >
                    {buttonType !== null && buttonType}
                    {buttonType === null && (
                      <>
                        <i className="icon-cancel" /> Remove
                        <br />
                        from my list
                      </>
                    )}
                  </button>
                )}
                {!userMovieMyListID.includes(modalContext.infosMovie.id) && (
                  <button
                    className="btn-addToMyList"
                    type="button"
                    onClick={handleAddToMyList}
                  >
                    {buttonType !== null && buttonType}
                    {buttonType === null && (
                      <>
                        <i className="icon-plus" /> Add to my list
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="bottom-infos-grid-platforms">{icones}</div>
              <div className="bottom-infos-grid-synopsis">
                {modalContext.infosMovie.synopsis}
              </div>
            </div>
          </div>
        </main>
      </Modal>
    </div>
  );
};

export default ItemModal;
