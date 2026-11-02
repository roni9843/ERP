import { Schema, type Query } from 'mongoose';
import { requestContext } from '../../context/request-context';

/**
 * Records who created and last changed a document (`createdBy`, `updatedBy`),
 * taking the user from the request context. Timestamps come from `{ timestamps: true }`.
 */
export function auditFieldsPlugin(schema: Schema): void {
  schema.add({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', immutable: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  });

  schema.pre('save', function () {
    const userId = requestContext.get()?.userId;
    if (!userId) return;
    if (this.isNew && !this.get('createdBy')) this.set('createdBy', userId);
    this.set('updatedBy', userId);
  });

  schema.pre(
    ['findOneAndUpdate', 'updateOne', 'updateMany'],
    { document: false, query: true },
    function (this: Query<unknown, unknown>) {
      const userId = requestContext.get()?.userId;
      if (userId) this.set({ updatedBy: userId });
    },
  );
}
