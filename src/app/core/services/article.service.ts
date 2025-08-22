import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { deleteDoc, DocumentData, getDoc, getDocs, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Article } from '../../models/articles';
import { AuthserviceService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(
    private fireStore: Firestore,
    private authService: AuthserviceService
  ) {}

  addArticle(
    uid: string,
    title: string,
    description: string,
    shortDescription: string,
    authorName: string,
    articleImageUrl: string,
    tags: string[],
    lastModifiedDate: string,
  ): Observable<void> {
    const articlesCollection = collection(this.fireStore, 'articles');

    return from(addDoc(articlesCollection, {
      uid,
      title,
      description,
      shortDescription,
      authorName,
      articleImageUrl,
      tags,
      lastModifiedDate: new Date(lastModifiedDate),
    })).pipe(
      map(() => {
        console.log('Article added successfully to collection');
      }),
      catchError((error) => {
        console.error('Failed to add article to firestore:', error);
        return throwError(() => error);
      })
    );
  }

  updateArticle(
    id: string,
    updatedData: {
      uid?: string;
      title?: string;
      description?: string;
      shortDescription?: string;
      authorName?: string;
      articleImageUrl?: string;
      tags?: string[];
      lastModifiedDate?: string | Date;
    }
  ): Observable<void> {
    const articleRef = doc(this.fireStore, 'articles', id);
    const dataToUpdate = {
      ...updatedData,
      ...(updatedData.lastModifiedDate
        ? { lastModifiedDate: new Date(updatedData.lastModifiedDate) }
        : {}),
    };

    return from(updateDoc(articleRef, dataToUpdate)).pipe(
      map(() => {
        console.log('Article updated successfully');
      }),
      catchError((error) => {
        console.error('Failed to update article in firestore:', error);
        return throwError(() => error);
      })
    );
  }

  deleteArticle(documentId: string): Observable<void> {
    const articleDocRef = doc(this.fireStore, `articles/${documentId}`);

    return from(deleteDoc(articleDocRef)).pipe(
      map(() => {
        console.log(`Article with ID ${documentId} deleted successfully`);
      }),
      catchError((error) => {
        console.error('Error deleting article:', error);
        return throwError(() => error);
      })
    );
  }

  getArticles(): Observable<Article[]> {
    const articlesCollection = collection(this.fireStore, 'articles');

    return from(getDocs(articlesCollection)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const lastModifiedDate = (data.lastModifiedDate as Timestamp)?.toDate();
          const tags: string[] = Array.isArray(data.tags) ? data.tags : [];

          return {
            id: doc.id,
            uid: data.uid,
            title: data.title,
            articleImageUrl: data.articleImageUrl,
            shortDescription: data.shortDescription,
            authorName: data.authorName,
            description: data.description,
            tags,
            lastModifiedDate,
          } as Article;
        });
      }),
      catchError((error) => {
        console.error('Error fetching articles: ', error);
        return throwError(() => error);
      })
    );
  }

  getArticlesById(id: string): Observable<Article> {
    const docRef = doc(this.fireStore, 'articles', id);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error('Article not found.');
        }

        const data = docSnap.data();
        const lastModifiedDate = (data.lastModifiedDate as Timestamp)?.toDate();
        const tags: string[] = Array.isArray(data.tags) ? data.tags : [];

        return {
          id: docSnap.id,
          uid: data.uid,
          title: data.title,
          articleImageUrl: data.articleImageUrl,
          shortDescription: data.shortDescription,
          authorName: data.authorName,
          description: data.description,
          tags,
          lastModifiedDate,
        } as Article;
      }),
      catchError((error) => {
        console.error('Error fetching article by ID:', error);
        return throwError(() => error);
      })
    );
  }
}
