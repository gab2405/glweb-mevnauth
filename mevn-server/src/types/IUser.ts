export interface IUser {
  name: string;
  method: "local";
  local: {
    email: string;
    password: string;
  },
  emailConfirmed: boolean;
  resetPW: {
    token: string;
    date: Date;
  },
  userGroup: string;
  status: "active" | "canceled",
  dates: {
    registered: Date,
    lastEdited: Date,
    lastPasswordReset: Date,
    deletedOn: Date
  },
  deleted: boolean;
}