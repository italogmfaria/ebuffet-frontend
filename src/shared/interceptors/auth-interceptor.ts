import {HttpInterceptorFn} from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  let headers = req.headers;
  if (token) headers = headers.set('Authorization', `Bearer ${token}`);
  return next(req.clone({ headers }));
};
