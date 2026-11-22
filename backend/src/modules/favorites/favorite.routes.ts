import { Router } from "express";
import { favoriteController } from "./favorite.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const favoriteRouter: Router = Router();

favoriteRouter.use(authenticate);

// list brand favorites with pagination
favoriteRouter.get("/", favoriteController.getMyFavorites);

// check if a creator is favorited
favoriteRouter.get("/check/:creatorProfileId", favoriteController.checkIsFavorited);

// toggle favorite status for a creator
favoriteRouter.post("/:creatorProfileId", favoriteController.toggleFavorite);

export default favoriteRouter;
