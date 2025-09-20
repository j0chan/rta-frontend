import { Injectable } from '@angular/core'
import { CanMatch, Route, UrlSegment, Router, UrlTree, CanActivate } from '@angular/router'

function getToken(): string | null {
    return localStorage.getItem('access_token') || localStorage.getItem('accessToken');
}
function getRoleFromJWT(token: string | null): string | null {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload?.role ?? payload?.roles?.[0] ?? null;
    } catch { return null; }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanMatch, CanActivate {
    constructor(private router: Router) { }

    private allow(): boolean {
        const role = getRoleFromJWT(getToken());
        return role === 'ADMIN';
    }

    canMatch(_route: Route, _segments: UrlSegment[]): boolean | UrlTree {
        return this.allow() ? true : this.router.createUrlTree(['/']);
    }

    canActivate(): boolean | UrlTree {
        return this.allow() ? true : this.router.createUrlTree(['/']);
    }
}