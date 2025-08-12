import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
  Timestamp,
} from '@angular/fire/firestore';


import { Article } from '../../models/articles';
import { where, query} from 'firebase/firestore';
import { AuthserviceService } from './auth.service';


  @Injectable({
    providedIn: 'root',
  })
  
  export class FetchOwnArticlesService {
    constructor(
      private firestore: Firestore,
      private authService: AuthserviceService,
    ) {}


  async getArticles(): Promise<Article[]> { //fetching of articles with authorization, i.e. specific User Id.
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found in token.');
      return [];
    }

    try {
      const q = query(
        collection(this.firestore, 'articles'),
        where('uid', '==', userId),
      );

      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const lastModifiedDate = (
          data['lastModifiedDate'] as Timestamp
        )?.toDate();
        const tags: string[] = Array.isArray(data['tags']) ? data['tags'] : [];

        return {
          id: doc.id,
          uid: data['uid'],
          title: data['title'],
          articleImageUrl: data['articleImageUrl'],
          shortDescription: data['shortDescription'],
          authorName: data['authorName'],
          description: data['description'],
          tags,
          lastModifiedDate,
        } as Article;
      });
    } catch (error) {
      console.error('Error fetching articles: ', error);
      return [];
    }
  }
}
