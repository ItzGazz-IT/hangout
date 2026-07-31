import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import type { UserProfile } from '@types/user.types';

export const usersService = {
  async update(uid: string, data: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
