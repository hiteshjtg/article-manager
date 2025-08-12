import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { deleteDoc, DocumentData, getDoc, getDocs, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { Article } from '../../models/articles';
import { AuthserviceService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

export class ArticlesService {

  constructor(private fireStore: Firestore,
    private authService: AuthserviceService
  ) {}

  async addArticle(
    uid: string,
    title: string,
    description: string,
    shortDescription: string,
    authorName: string,
    articleImageUrl: string,
    tags: string[],
    lastModifiedDate: string,
  ): Promise<void> {
    try {
      const articlesCollection = collection(this.fireStore, 'articles');
      await addDoc(articlesCollection, {
        uid,
        title,
        description,
        shortDescription,
        authorName,
        articleImageUrl,
        tags,
        lastModifiedDate: new Date(lastModifiedDate),
      });
      console.log('Article added successfully to collection');
    } catch (error) {
      console.error('Failed to add article to firestore:', error);
    }
  }



  async updateArticle(
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
  ): Promise<void> {
    try {
      const articleRef = doc(this.fireStore, 'articles', id);
      const dataToUpdate = {
        ...updatedData,
        ...(updatedData.lastModifiedDate
          ? { lastModifiedDate: new Date(updatedData.lastModifiedDate) }
          : {}),
      };
      await updateDoc(articleRef, dataToUpdate);
      console.log('Article updated successfully');
    } catch (error) {
      console.error('Failed to update article in firestore:', error);
    }
  }



  async deleteArticle(documentId: string): Promise<void> {
      try {
        const articleDocRef = doc(this.fireStore, `articles/${documentId}`);
        await deleteDoc(articleDocRef);
        console.log(`Article with ID ${documentId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
      }
  }




  async getArticles(): Promise<Article[]> {
    try {
      const articlesCollection = collection(this.fireStore, 'articles');
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




  async getArticlesById(id: string): Promise<Article> {
    try {
      const docRef = doc(this.fireStore, 'articles', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Article not found.');
      }

      const data = docSnap.data();


      const lastModifiedDate = (
        data['lastModifiedDate'] as Timestamp
      )?.toDate();

      const tags: string[] = Array.isArray(data['tags']) ? data['tags'] : [];

      return {
        id: docSnap.id,
        uid: data['uid'],
        title: data['title'],
        articleImageUrl: data['articleImageUrl'],
        shortDescription: data['shortDescription'],
        authorName: data['authorName'],
        description: data['description'],
        tags,
        lastModifiedDate,
      } as Article;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
  }

}
