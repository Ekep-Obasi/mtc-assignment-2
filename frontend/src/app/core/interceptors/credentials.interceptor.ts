import { HttpInterceptorFn } from '@angular/common/http';

// attach credentials (cookies) to every outgoing request
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
