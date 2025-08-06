import { create } from 'zustand';

interface BookState {
  selectedBook: string | null;
  selectedChapter: string | null;
  setSelectedBook: (bookId: string | null) => void;
  setSelectedChapter: (chapterId: string | null) => void;
}

export const useBookStore = create<BookState>((set) => ({
  selectedBook: null,
  selectedChapter: null,
  setSelectedBook: (bookId) => set({ selectedBook: bookId }),
  setSelectedChapter: (chapterId) => set({ selectedChapter: chapterId }),
}));