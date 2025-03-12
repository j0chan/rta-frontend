import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private apiUrl = 'http://localhost:3000/api/stores'
    constructor() { }
}
