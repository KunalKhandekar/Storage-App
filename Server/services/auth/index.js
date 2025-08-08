import { registerUserService } from "./registerUserService.js";
import { loginUserService } from "./loginUserService.js";
import { loginWithGoogleService } from "./loginWithGoogleService.js";
import { loginWithGitHubService } from "./loginWithGitHubService.js";
import { refreshUserSessionService } from "./refreshUserSessionService.js";

export default {
  RegisterUserService: registerUserService,
  LoginUserService: loginUserService,
  LoginWithGoogleService: loginWithGoogleService,
  LoginWithGitHubService: loginWithGitHubService,
  RefreshUserSessionService: refreshUserSessionService,
};
