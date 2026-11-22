import { Router } from "express";
import { profileController } from "./profile.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import {
  updateCreatorProfileSchema,
  updateBrandProfileSchema,
  socialAccountSchema,
  portfolioItemSchema,
} from "./profile.schema.js";

const profileRouter: Router = Router();


profileRouter.get("/me", authenticate, profileController.getMyProfile);

// Creator endpoints
profileRouter.put(
  "/creator",
  authenticate,
  validate(updateCreatorProfileSchema),
  profileController.updateCreatorProfile
);

profileRouter.post(
  "/creator/socials",
  authenticate,
  validate(socialAccountSchema),
  profileController.upsertSocialAccount
);

profileRouter.delete(
  "/creator/socials/:id",
  authenticate,
  profileController.deleteSocialAccount
);

profileRouter.post(
  "/creator/portfolio",
  authenticate,
  validate(portfolioItemSchema),
  profileController.addPortfolioItem
);

profileRouter.delete(
  "/creator/portfolio/:id",
  authenticate,
  profileController.deletePortfolioItem
);

profileRouter.put(
  "/brand",
  authenticate,
  validate(updateBrandProfileSchema),
  profileController.updateBrandProfile
);


profileRouter.get("/creator/:id", profileController.getPublicCreator);
profileRouter.get("/brand/:id", profileController.getPublicBrand);

export default profileRouter;
