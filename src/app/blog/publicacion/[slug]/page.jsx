import { getOnePost } from '@/app/_actions';
import ViewPostDetails from '@/components/blog/ViewPostDetails';

const BlogPostPage = async ({ params }) => {
  const data = await getOnePost(params.slug);
  const post = JSON.parse(data.post);
  const trendingProducts = JSON.parse(data.trendingProducts);
  return <ViewPostDetails post={post} trendingProducts={trendingProducts} />;
};

export default BlogPostPage;
