declare namespace Express {
  export interface Request {
    user?: import('mongoose').HydratedDocument<
      import('./src/modules/user/models').User
    >;
    accessToken?: string;
  }
}
