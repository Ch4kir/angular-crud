import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
  
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiURL = "https://jsonplaceholder.typicode.com";

  /*------------------------------------------
  --------------------------------------------
  Http Header Options
  --------------------------------------------
  --------------------------------------------*/

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/

  constructor(private httpClient : HttpClient) {}
  
  
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }


 getAll(): Observable<any> {
  // Try to get data from local storage first
  const cachedData = localStorage.getItem('cachedData');
  if (cachedData) {
    return of(JSON.parse(cachedData));
  }

  // If not in local storage, fetch data from the API
  return this.httpClient.get(this.apiURL + '/posts').pipe(
    tap(data => {
      // Cache the data in local storage for later use
      localStorage.setItem('cachedData', JSON.stringify(data));
    }),
    catchError(this.errorHandler)
  );
}

create(post: Post): Observable<any> {
  // Retrieve existing data from local storage
  const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
  
  // Assign a unique ID to the new post, for example, by incrementing the highest existing ID
  const highestId = cachedData.reduce((maxId: number, item: { id: number; }) => Math.max(maxId, item.id), 0);
  post.id = highestId + 1;

  // Add the new post to the cached data
  cachedData.push(post);
  
  // Update local storage with the updated data
  localStorage.setItem('cachedData', JSON.stringify(cachedData));
  
  return of(post); // Return the created post as an observable
}

  

  find(id: number): Observable<any> {
    // Try to get data from local storage based on the provided id
    const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
    const foundItem = cachedData.find((item: any) => item.id === id);

    // If found in local storage, return it as an observable
    if (foundItem) {
      return of(foundItem);
    }

    // If not found in local storage, return an empty observable
    return of(null);
  }

  
  update(id: number, post: Post): void {
    // Try to get data from local storage
    const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
    const updatedData = cachedData.map((item: any) => {
      if (item.id === id) {
        return { ...item, ...post };
      }
      return item;
    });

    // Update the data in local storage
    localStorage.setItem('cachedData', JSON.stringify(updatedData));
  }

  
  resetAll(): Observable<any>{
    return this.httpClient.get(this.apiURL + '/posts').pipe(
      tap(data => {
        // Cache the data in local storage for later use
        localStorage.setItem('cachedData', JSON.stringify(data));
      }),
      catchError(this.errorHandler)
    );
    
  }

  delete(id: number): Observable<any> {
    // Remove the item with the provided id from local storage
    const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
    const updatedData = cachedData.filter((item: any) => item.id !== id);

    // Update local storage with the updated data
    localStorage.setItem('cachedData', JSON.stringify(updatedData));

    // Optionally, you can return a response observable, but it's not necessary
    return of('Delete operation completed successfully');
  }

  
 
}
