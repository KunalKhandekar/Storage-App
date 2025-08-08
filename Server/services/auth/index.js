import { registerUserService } from "./registerUserService.js";
import { loginUserService } from "./loginUserService.js";
import { loginWithGoogleService } from "./loginWithGoogleService.js";
import { loginWithGitHubService } from "./loginWithGitHubService.js";

export default {
  RegisterUserService: registerUserService,
  LoginUserService: loginUserService,
  LoginWithGoogleService: loginWithGoogleService,
  LoginWithGitHubService: loginWithGitHubService,
};
