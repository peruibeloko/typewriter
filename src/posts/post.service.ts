import { PostEntity } from '@/posts/post.model.ts';

export function paginatedList(page: number, size: number) {
  return {};
}

export function create(title: string, author: string, content: string) {
  return PostEntity.new(title, author, content).create();
}

export async function getById(id: string) {
  return PostEntity.read(id);
}

export async function updateById(
  id: string,
  post?: PostEntity,
  content?: string,
) {
  if (post === void 0 && content === void 0) {
    return new Error('Nothing was provided to update');
  }

  if (post) {
  }
}

export async function deleteById(id: string) {}
