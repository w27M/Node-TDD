import { CanDeactivateFn } from '@angular/router';
import { SignUpComponent } from '../components/signup/signup';

export const signUpDeactivateGuard: CanDeactivateFn<SignUpComponent> = (
  component: SignUpComponent
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
