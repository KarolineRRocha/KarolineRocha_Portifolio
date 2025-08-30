import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class GitHubApiInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adicionar headers para requisições à API do GitHub
    if (request.url.includes('api.github.com')) {
      const headers: any = {
        'Accept': 'application/vnd.github.v3+json'
      };

      // Add authorization header if token is available
      if (environment.github.token) {
        headers['Authorization'] = `token ${environment.github.token}`;
      }

      const modifiedRequest = request.clone({
        setHeaders: headers
      });
      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}
