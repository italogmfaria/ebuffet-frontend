import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {ThemeService} from "../services/theme.service";

export const buffetIdInterceptor: HttpInterceptorFn = (req, next) => {
  const themeService = inject(ThemeService);
  const buffetId = themeService.getBuffetIdSync?.();

  if (!buffetId) return next(req);

  return next(req.clone({
    setHeaders: { 'X-Buffet-Id': String(buffetId) }
  }));
};

