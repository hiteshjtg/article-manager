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

@Injectable({
  providedIn: 'root',
})
export class ArticlesFetchServiceService {
  constructor(private firestore: Firestore) {}

  async getArticles(): Promise<Article[]> {
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      const querySnapshot: QuerySnapshot<DocumentData> =
        await getDocs(articlesCollection);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const lastModifiedDate = (
          data['lastModifiedDate'] as Timestamp
        )?.toDate();
        const tags: string[] = Array.isArray(data['tags']) ? data['tags'] : [];

        return {
          id: doc.id,
          articleImageUrl: data['articleImageUrl'],
          shortDescription: data['shortDescription'],
          authorName: data['authorName'],
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
