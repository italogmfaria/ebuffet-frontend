import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';

export const userIdInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const user = sessionService.getUser();

  if (!user?.id) return next(req);

  return next(req.clone({
    setHeaders: { 'X-User-Id': String(user.id) }
  }));
};
