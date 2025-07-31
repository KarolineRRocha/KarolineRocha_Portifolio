import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GitHubApiInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adicionar headers para requisições à API do GitHub
    if (request.url.includes('api.github.com')) {
      const modifiedRequest = request.clone({
        setHeaders: {
          'User-Agent': 'Portfolio-App/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}
