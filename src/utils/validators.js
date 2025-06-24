export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  "Your string fails to match the Object Id pattern!";

export const PASSWORD_RULE =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
export const PASSWORD_RULE_MESSAGE =
  "Your password fails to match the password pattern! At least one uppercase letter, at least one special character, at least one digit, minimum length of 8 characters";
