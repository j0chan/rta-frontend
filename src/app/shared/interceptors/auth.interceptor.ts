import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Observable } from "rxjs"

export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('accessToken')

        if (token) {
            const clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
            return next.handle(clonedReq)
        }
        return next.handle(req)
    }
}