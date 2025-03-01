import { PostEntity } from '@/posts/post.model.ts';

export function paginatedList(page: number, size: number) {
  return PostEntity.list(page, size);
}

export function create(title: string, author: string, content: string) {
  return PostEntity.new(title, author, content).create();
}

export function getById(id: string) {
  return PostEntity.read(id);
}

export function updateById(id: string, post: PostEntity, content: string) {}

export function deleteById(id: string) {
  PostEntity.delete(id);
}
